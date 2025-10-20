import { Move } from "./gameTypes";

export enum PieceType {
    PAWN = 'p',
    ROOK = 'r',
    KNIGHT = 'n',
    BISHOP = 'b',
    QUEEN = 'q',
    KING = 'k',
}

export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SquareId = `${File}${Rank}`;

export const SQUARE_COLOURS = {
    'a': {
        '1': 'black',
        '2': 'white',
        '3': 'black',
        '4': 'white',
        '5': 'black',
        '6': 'white',
        '7': 'black',
        '8': 'white',
    }, 
    'b': {
        '1': 'white', 
        '2': 'black', 
        '3': 'white',
        '4': 'black',
        '5': 'white',
        '6': 'black',
        '7': 'white',
        '8': 'black',
    },
    'c': {
        '1': 'black',
        '2': 'white',
        '3': 'black',
        '4': 'white',
        '5': 'black',
        '6': 'white',
        '7': 'black',
        '8': 'white',
    }, 
    'd': {
        '1': 'white', 
        '2': 'black', 
        '3': 'white',
        '4': 'black',
        '5': 'white',
        '6': 'black',
        '7': 'white',
        '8': 'black',
    },
    'e': {
        '1': 'black',
        '2': 'white',
        '3': 'black',
        '4': 'white',
        '5': 'black',
        '6': 'white',
        '7': 'black',
        '8': 'white',
    }, 
    'f': {
        '1': 'white', 
        '2': 'black', 
        '3': 'white',
        '4': 'black',
        '5': 'white',
        '6': 'black',
        '7': 'white',
        '8': 'black',
    },
    'g': {
        '1': 'black',
        '2': 'white',
        '3': 'black',
        '4': 'white',
        '5': 'black',
        '6': 'white',
        '7': 'black',
        '8': 'white',
    }, 
    'h': {
        '1': 'white', 
        '2': 'black', 
        '3': 'white',
        '4': 'black',
        '5': 'white',
        '6': 'black',
        '7': 'white',
        '8': 'black',
    },
}

export type PieceColor = 'w' | 'b';

export type PieceId = `${PieceColor}${PieceType}`;

export type Board = {
    [key in SquareId]: PieceId | null;
};

/**
 * @description Board state of the application
 * @property selectedSquare - The square on board that is currently selected by the user
 * @property lastMove - The squares involved in the last move (from, to)
 * 
 * 
 */
export interface BoardState {
    selectedSquare: SquareId | null;
    lastMove: Move | null;
    legalSquares: SquareId[];
    board: Board;
}