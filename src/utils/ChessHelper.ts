import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Board, SquareId, PieceId } from '../types/boardTypes';
import { Chess } from 'chess.js';
import { placementToBoard } from './fen';

// OVERVIEW: Load chess piece
// - index: index of type of piece
// - suit: color of chess piece
function LoadChessPiece(index, suit, title) {
	const chessModel = useGLTF(suit === 'white' ? './models/chess_white.glb' : './models/chess_black.glb');

	// const piece = chessModel.scene.clone().children[0].children[0].children[0].children[index];
	const piece = chessModel.nodes[title].clone();
	piece.children[0].material.color = new THREE.Color(suit === 'white' ? 'white' : 0x555555);

	return piece;
}

// Pieces Index List
// 0 -> Pawn
// 1 -> Queen
// 2 -> Rook
// 3 -> Knight
// 4 -> King
// 5 -> Bishop
function LoadChessTeam(suit) {
	const pieces = [];

	Array(8)
		.fill(null)
		.map((_, index) => {
			const piece = {};
			piece['obj'] = LoadChessPiece(0, suit, 'Pawn');
			piece['pos'] = { x: index, y: suit === 'white' ? 1 : 6 };
			piece['rot'] = [0, 0, 0];
			piece['visible'] = true;
			piece['type'] = 'Pawn';
			piece['points'] = 1;
			piece['code'] = 'P' + (1 + index);
			pieces.push(piece);
		});

	Array(2)
		.fill(null)
		.map((_, index) => {
			const piece = {};
			piece['obj'] = LoadChessPiece(2, suit, 'Rook');
			piece['pos'] = { x: index === 0 ? 0 : 7, y: suit === 'white' ? 0 : 7 };
			piece['rot'] = [0, 0, 0];
			piece['visible'] = true;
			piece['type'] = 'Rook';
			piece['points'] = 5;
			piece['code'] = 'R' + (1 + index);
			pieces.push(piece);
		});

	Array(2)
		.fill(null)
		.map((_, index) => {
			const piece = {};
			piece['obj'] = LoadChessPiece(3, suit, 'Knight');
			piece['pos'] = { x: index === 0 ? 1 : 6, y: suit === 'white' ? 0 : 7 };
			piece['rot'] = [-Math.PI / 2, 0, suit === 'white' ? Math.PI / 2 : -Math.PI / 2];
			piece['visible'] = true;
			piece['type'] = 'Knight';
			piece['points'] = 3;
			piece['code'] = 'N' + (index + 1);
			pieces.push(piece);
		});

	Array(2)
		.fill(null)
		.map((_, index) => {
			const piece = {};
			piece['obj'] = LoadChessPiece(5, suit, 'Bishop');
			piece['pos'] = { x: index === 0 ? 2 : 5, y: suit === 'white' ? 0 : 7 };
			piece['rot'] = [-Math.PI / 2, 0, 0];
			piece['visible'] = true;
			piece['type'] = 'Bishop';
			piece['points'] = 3;
			piece['code'] = 'B' + (index + 1);
			pieces.push(piece);
		});

	Array(2)
		.fill(null)
		.map((_, index) => {
			const piece = {};
			piece['obj'] = LoadChessPiece(index === 0 ? 1 : 4, suit, index === 0 ? 'King' : 'Queen');
			piece['pos'] = { x: index === 0 ? 3 : 4, y: suit === 'white' ? 0 : 7 };
			piece['rot'] = index === 1 ? [0, Math.PI / 2, 0] : [-Math.PI / 2, 0, 0];
			piece['type'] = index === 0 ? 'King' : 'Queen';
			piece['visible'] = true;
			piece['points'] = piece.type === 'King' ? Infinity : 9;
			piece['code'] = piece.type === 'King' ? 'K' : 'Q';
			pieces.push(piece);
		});

	return pieces;
}

/**
 * @description Create Board state from fen string
 * @param fen - The fen string to create the board from
 * @returns The board state
 */
export const createBoard = (fen: string): Board => {
	// Extract the placement part from FEN (first part before space)
	const placement = fen.split(' ')[0];
	
	// Convert placement to 8x8 array using existing helper
	const boardArray = placementToBoard(placement);
	
	// Convert 8x8 array to Board object
	const board: Board = {} as Board;
	
	// Files are a-h (0-7), Ranks are 1-8 (0-7)
	const files: Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	
	for (let rank = 0; rank < 8; rank++) {
		for (let file = 0; file < 8; file++) {
			// FEN ranks: rank 0 in array = rank 8 in chess, rank 7 in array = rank 1 in chess
			const chessRank = (7 - rank + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
			const squareId: SquareId = `${files[file]}${chessRank}`;
			const piece = boardArray[rank][file];
			
			if (piece === null) {
				board[squareId] = null;
			} else {
				// Convert piece character to PieceId
				// Uppercase = white (w), lowercase = black (b)
				const color: 'w' | 'b' = piece === piece.toUpperCase() ? 'w' : 'b';
				const pieceType = piece.toLowerCase();
				const pieceId = `${color}${pieceType}` as PieceId;
				board[squareId] = pieceId;
			}
		}
	}
	
	return board;
}

/**
 * @description Get legal moves for a specific square using chess.js
 * @param fen - The current FEN string representing the board state
 * @param squareId - The square to get legal moves for
 * @returns Array of SquareId strings representing legal move destinations
 */
export const getLegalMoves = (fen: string, squareId: SquareId): SquareId[] => {
	try {
		const chess = new Chess(fen);
		const moves = chess.moves({ square: squareId, verbose: true });
		
		// Extract the 'to' squares from the moves
		return moves.map(move => move.to as SquareId);
	} catch (error) {
		console.error('Error getting legal moves:', error);
		return [];
	}
};

export { LoadChessPiece, LoadChessTeam };
