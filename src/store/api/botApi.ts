import axios from 'axios';
import { BotDifficulty } from '../../types/uiTypes';

export interface MoveRequest {
    fen: string;
    max_depth: number;
    difficulty: string;
}

export interface MoveResponse {
    best_move: string;
    score_cp: number;
}

// Map difficulty to max_depth
const difficultyToDepth: Record<BotDifficulty, number> = {
    'easy': 12,
    'medium': 8,
    'hard': 8
};



interface TransformerMoveResponse {
    best_move: string;
    error?: string;
}

const fetchTransformerMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
    try {
        const apiBaseUrl = import.meta.env.VITE_API_TRANSFORMER_URL || 'http://localhost:8001/v1/api/transformer-move';
        const payload: any = { pgn };
        if (agent !== undefined) payload.agent = agent;
        
        const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        
        if (!response.data.best_move) {
            throw new Error('Model failed to generate a valid legal move');
        }

        return {
            best_move: response.data.best_move,
            score_cp: 0 // Transformer doesn't return score usually, or we can mock it
        };
    } catch (error) {
        console.error('Transformer API error:', error);
        throw error;
    }
};

export const fetchBotMove = async (fen: string, difficulty: BotDifficulty = 'medium', pgn: string = "", agent?: number): Promise<MoveResponse> => {
    // For medium difficulty, use the transformer model if PGN is available
    if (difficulty === 'easy') {
        try {
            return await fetchMediumModeMove(pgn, agent);
        } catch (error) {
            console.warn('Falling back to minimax due to medium mode error:', error);
            // Fallback to existing logic if medium mode fails
        }
    }
    if (difficulty === 'medium') {
        try {
            return await fetchTransformerMove(pgn, agent);
        } catch (error) {
            console.warn('Falling back to minimax due to transformer error:', error);
            // Fallback to existing logic if transformer fails
        }
    } else if (difficulty === 'hard') {
        try {
            return await fetchTransformerSearchMove(pgn, agent);
        } catch (error) {
            console.warn('Falling back to minimax due to transformer error:', error);
            // Fallback to existing logic if transformer fails
        }
    }

    const requestBody: any = {
        fen,
        max_depth: difficultyToDepth[difficulty],
        difficulty
    };
    if (agent !== undefined) requestBody.agent = agent;

    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/v1/api/move';
        const response = await axios.post(apiBaseUrl, requestBody);

        const data: MoveResponse = response.data;
        
        if (!data.best_move) {
            throw new Error('Invalid response: missing best_move');
        }

        return data;
    } catch (error) {
        console.error('Bot API error:', error);
        throw new Error(`Failed to get bot move: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const fetchTransformerSearchMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
    try {
        const apiBaseUrl = import.meta.env.VITE_API_TRANSFORMER_URL || 'http://localhost:8001/v1/api/mcts-3';
        const payload: any = { pgn };
        if (agent !== undefined) payload.agent = agent;

        const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        
        if (!response.data.best_move) {
            throw new Error('Model failed to generate a valid legal move');
        }

        return {
            best_move: response.data.best_move,
            score_cp: 0 // Transformer doesn't return score usually, or we can mock it
        };
    } catch (error) {
        console.error('Transformer API error:', error);
        throw error;
    }
};

export const fetchMediumModeMove = async (pgn: string, agent?: number): Promise<MoveResponse> => {
    try {
        console.log('Fetching medium mode move');
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/v1/api/alphabeta-eval';
        const payload: any = { pgn };
        if (agent !== undefined) payload.agent = agent;

        const response = await axios.post<TransformerMoveResponse>(apiBaseUrl, payload);
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        
        if (!response.data.best_move) {
            throw new Error('Model failed to generate a valid legal move');
        }

        return {
            best_move: response.data.best_move,
            score_cp: 0 // Transformer doesn't return score usually, or we can mock it
        };
    } catch (error) {
        console.error('Transformer API error:', error);
        throw error;
    }
};