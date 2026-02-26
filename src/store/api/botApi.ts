import axios from 'axios';
import { BotDifficulty } from '../../types/uiTypes';

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

/** Submit job and poll until COMPLETED or FAILED */
async function runPodJob(difficulty: BotDifficulty, pgn: string): Promise<MoveResponse> {
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
    }

    throw new Error('RunPod job timed out');
}

export const fetchBotMove = async (
    _fen: string,
    difficulty: BotDifficulty = 'medium',
    pgn: string = '',
    _agent?: number
): Promise<MoveResponse> => {
    return runPodJob(difficulty, pgn);
};

// ---------------------------------------------------------------------------
// Previous direct API routes (commented out – now using RunPod above)
// ---------------------------------------------------------------------------
//
// export interface MoveRequest {
//     fen: string;
//     max_depth: number;
//     difficulty: string;
// }
//
// const difficultyToDepth: Record<BotDifficulty, number> = {
//     easy: 12,
//     medium: 8,
//     hard: 8,
// };
//
// interface TransformerMoveResponse {
//     best_move: string;
//     error?: string;
// }
//
// const fetchTransformerMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
//     const apiBaseUrl = import.meta.env.VITE_API_TRANSFORMER_URL || 'http://localhost:8001/v1/api/transformer-move';
//     const payload: any = { pgn };
//     if (agent !== undefined) payload.agent = agent;
//     const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
//     if (response.data.error) throw new Error(response.data.error);
//     if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
//     return { best_move: response.data.best_move, score_cp: 0 };
// };
//
// export const fetchMediumModeMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
//     const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/v1/api/alphabeta-eval';
//     const payload: any = { pgn };
//     if (agent !== undefined) payload.agent = agent;
//     const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
//     if (response.data.error) throw new Error(response.data.error);
//     if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
//     return { best_move: response.data.best_move, score_cp: 0 };
// };
//
// export const fetchTransformerSearchMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
//     const apiBaseUrl = import.meta.env.VITE_API_TRANSFORMER_URL || 'http://localhost:8001/v1/api/mcts-3';
//     const payload: any = { pgn };
//     if (agent !== undefined) payload.agent = agent;
//     const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
//     if (response.data.error) throw new Error(response.data.error);
//     if (!response.data.best_move) throw new Error('Model failed to generate a valid legal move');
//     return { best_move: response.data.best_move, score_cp: 0 };
// };
//
// Old fetchBotMove (direct URLs):
//
// export const fetchBotMove = async (fen: string, difficulty: BotDifficulty = 'medium', pgn: string = '', agent?: number): Promise<MoveResponse> => {
//     if (difficulty === 'easy') {
//         try {
//             return await fetchTransformerMove(pgn, agent);
//         } catch (error) {
//             console.warn('Falling back to minimax due to transformer error:', error);
//         }
//     }
//     if (difficulty === 'medium') {
//         try {
//             return await fetchMediumModeMove(pgn, agent);
//         } catch (error) {
//             console.warn('Falling back to minimax due to medium mode error:', error);
//         }
//     } else if (difficulty === 'hard') {
//         try {
//             return await fetchTransformerSearchMove(pgn, agent);
//         } catch (error) {
//             console.warn('Falling back to minimax due to transformer error:', error);
//         }
//     }
//     const requestBody: any = { fen, max_depth: difficultyToDepth[difficulty], difficulty };
//     if (agent !== undefined) requestBody.agent = agent;
//     const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/v1/api/move';
//     const response = await axios.post(apiBaseUrl, requestBody);
//     const data: MoveResponse = response.data;
//     if (!data.best_move) throw new Error('Invalid response: missing best_move');
//     return data;
// };
