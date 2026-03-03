import axios from 'axios';
import { BotDifficulty } from '../../types/uiTypes';

/** When true (default), use RunPod API; when false, use local backend at localhost:8001 */
const USE_RUNPOD = import.meta.env.VITE_USE_RUNPOD !== 'false';

const LOCAL_BASE = 'http://localhost:8001/v1/api';
const RUNPOD_BASE = 'https://api.runpod.ai/v2/jghaygl631t1rr';
const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 120; // 3 min max

function getRunPodApiKey(): string {
    const key = import.meta.env.VITE_RUNPOD_API_KEY || import.meta.env.VITE_API_KEY;
    if (!key) throw new Error('RunPod API key not configured (VITE_RUNPOD_API_KEY or VITE_API_KEY)');
    return key;
}

export interface MoveResponse {
    best_move: string;
    score_cp: number;
}

/** RunPod /run response */
interface RunPodRunResponse {
    id: string;
    status: string;
}

/** RunPod /status response */
interface RunPodStatusResponse {
    id: string;
    status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    output?: {
        best_move?: string;
        score?: number;
        details?: unknown;
        error?: string | null;
    };
}

/** Build request body for POST /run */
function buildRunInput(difficulty: BotDifficulty, pgn: string): Record<string, unknown> {
    switch (difficulty) {
        case 'easy':
            return { endpoint: 'transformer-move', pgn };
        case 'medium':
            return { endpoint: 'alphabeta-eval', pgn, depth: 4 };
        case 'hard':
            return { endpoint: 'mcts-3', pgn, simulations: 400 };
        default:
            return { endpoint: 'alphabeta-eval', pgn, depth: 3 };
    }
}

/** Submit job and poll until COMPLETED or FAILED.
 * If no completed result arrives within ~60s, submit a fresh /run request (once) and try again.
 */
async function runPodJob(difficulty: BotDifficulty, pgn: string, retryCount = 0): Promise<MoveResponse> {
    const apiKey = getRunPodApiKey();
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
    };

    const input = buildRunInput(difficulty, pgn);
    const runRes = await axios.post<RunPodRunResponse>(
        `${RUNPOD_BASE}/run`,
        { input },
        { headers }
    );
    const jobId = runRes.data.id;
    if (!jobId) throw new Error('RunPod did not return a job id');

    const startTime = Date.now();

    for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        const statusRes = await axios.get<RunPodStatusResponse>(
            `${RUNPOD_BASE}/status/${jobId}`,
            { headers }
        );
        const { status, output } = statusRes.data;

        if (status === 'COMPLETED') {
            if (output?.error) throw new Error(output.error);
            if (!output?.best_move) throw new Error('RunPod response missing best_move');
            const score = typeof output.score === 'number' ? output.score : 0;
            return {
                best_move: output.best_move,
                score_cp: score,
            };
        }
        if (status === 'FAILED') {
            const msg = output?.error ?? 'Job failed';
            throw new Error(msg);
        }

        // If we've been waiting ~60s without completion, submit a new job once
        if (Date.now() - startTime > 60000 && retryCount < 1) {
            console.warn('RunPod job exceeded 60s without completion; retrying with a new job.');
            return runPodJob(difficulty, pgn, retryCount + 1);
        }
    }

    throw new Error('RunPod job timed out');
}

// --- Local backend (localhost:8001) ---
const difficultyToDepth: Record<BotDifficulty, number> = {
    easy: 12,
    medium: 8,
    hard: 8,
};

interface LocalMoveResponse {
    best_move: string;
    score_cp?: number;
    error?: string;
}

async function fetchLocalTransformerMove(pgn: string, agent?: number): Promise<MoveResponse> {
    const payload: Record<string, unknown> = { pgn };
    if (agent !== undefined) payload.agent = agent;
    const response = await axios.post<LocalMoveResponse>(`${LOCAL_BASE}/transformer-move`, payload);
    if (response.data.error) throw new Error(response.data.error);
    if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
    return { best_move: response.data.best_move, score_cp: response.data.score_cp ?? 0 };
}

async function fetchLocalMediumMove(pgn: string, agent?: number): Promise<MoveResponse> {
    const payload: Record<string, unknown> = { pgn };
    if (agent !== undefined) payload.agent = agent;
    const response = await axios.post<LocalMoveResponse>(`${LOCAL_BASE}/alphabeta-eval`, payload);
    if (response.data.error) throw new Error(response.data.error);
    if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
    return { best_move: response.data.best_move, score_cp: response.data.score_cp ?? 0 };
}

async function fetchLocalMctsMove(pgn: string, agent?: number): Promise<MoveResponse> {
    const payload: Record<string, unknown> = { pgn };
    if (agent !== undefined) payload.agent = agent;
    const response = await axios.post<LocalMoveResponse>(`${LOCAL_BASE}/mcts-3`, payload);
    if (response.data.error) throw new Error(response.data.error);
    if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
    return { best_move: response.data.best_move, score_cp: response.data.score_cp ?? 0 };
}

async function fetchLocalBotMove(
    fen: string,
    difficulty: BotDifficulty,
    pgn: string,
    agent?: number
): Promise<MoveResponse> {
    if (difficulty === 'easy') {
        try {
            return await fetchLocalTransformerMove(pgn, agent);
        } catch (e) {
            console.warn('Local transformer error, falling back to minimax:', e);
        }
    }
    if (difficulty === 'medium') {
        try {
            return await fetchLocalMediumMove(pgn, agent);
        } catch (e) {
            console.warn('Local alphabeta error, falling back to minimax:', e);
        }
    }
    if (difficulty === 'hard') {
        try {
            return await fetchLocalMctsMove(pgn, agent);
        } catch (e) {
            console.warn('Local MCTS error, falling back to minimax:', e);
        }
    }
    const body: Record<string, unknown> = {
        fen,
        max_depth: difficultyToDepth[difficulty],
        difficulty,
    };
    if (agent !== undefined) body.agent = agent;
    const response = await axios.post<MoveResponse>(`${LOCAL_BASE}/move`, body);
    if (!response.data.best_move) throw new Error('Invalid response: missing best_move');
    return response.data;
}

export const fetchBotMove = async (
    fen: string,
    difficulty: BotDifficulty = 'medium',
    pgn: string = '',
    agent?: number
): Promise<MoveResponse> => {
    if (USE_RUNPOD) {
        return runPodJob(difficulty, pgn);
    }
    return fetchLocalBotMove(fen, difficulty, pgn, agent);
};
