import { PieceType, SquareId } from "./boardTypes";

export enum GameMode {
    PASS_AND_PLAY = 'pass_and_play',
    VS_BOT = 'vs_bot'
}

export type PlayerColor = 'w' | 'b' | null;

export interface Team {
    color: 'white' | 'black';
    points: number;
    capturedPieces: PieceType[];
    timeRemaining: number; // in seconds
}

export type FenParts = {
    placement: string;
    active: 'w' | 'b';
    castling: string;
    enPassant: SquareId | '-';
    halfmove: number;
    fullmove: number;
}

export interface PieceMap {
    [key: string]: number;
}

export const PIECE_VALUE: PieceMap = {
    'p': 1,
    'r': 5,
    'b': 3,
    'n': 3,
    'q': 8,
}

/**
 * @description UI state of the application
 * @property fenParts - The parts of the FEN string for convenience
 * @property teams - Teams involved in the game with their points and captured pieces
 * @property gameMode - Current game mode (pass-and-play or vs-bot)
 * @property playerColor - User's color in vs-bot mode
 * @property showGameModeMenu - Controls menu visibility
 * @property botThinking - Loading state during bot move
 * 
 */
export interface UIState {
    fenParts: FenParts;
    teams: {
        w: Team;
        b: Team;
    };
    gameStarted: boolean;
    timerInterval: NodeJS.Timeout | null;
    gameMode: GameMode | null;
    playerColor: PlayerColor;
    showGameModeMenu: boolean;
    botThinking: boolean;
}