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
    'easy': 8,
    'medium': 8,
    'hard': 8
};

export const fetchBotMove = async (fen: string, difficulty: BotDifficulty = 'medium'): Promise<MoveResponse> => {
    const requestBody: MoveRequest = {
        fen,
        max_depth: difficultyToDepth[difficulty],
        difficulty
    };

    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1/api/move';
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
