import { PieceType, SquareId } from "./boardTypes";

export enum GameStatus {
    PLAYING = 'playing',
    DRAW = 'draw', 
    CHECKMATE = 'checkmate',
    STALEMATE = 'stalemate',
    CHECK = 'check',
    ERROR = 'error',
}

export interface Move {
    from: SquareId;
    to: SquareId;
    promotion?: PieceType;
}

/**
 * @description Game state of the application
 * @property fen - The FEN string of the game
 * @property history - The history of the game
 * @property playIndex - The index of the current move in the history
 * @property status - The status of the game
 */
export interface GameState {
    history: string[];
    playIndex: number;
    status: GameStatus;
}