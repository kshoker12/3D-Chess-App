import { Board, SquareId, PieceId, Piece } from '../types/boardTypes';
import { Chess } from 'chess.js';
import { placementToBoard } from './fen';

/**
 * @description Create Board state from fen string (only called once at initialization)
 * @param fen - The fen string to create the board from
 * @returns Object containing board and pieces array
 */
export const createBoard = (fen: string): { board: Board; pieces: Piece[] } => {
	// Extract the placement part from FEN (first part before space)
	const placement = fen.split(' ')[0];
	
	// Convert placement to 8x8 array using existing helper
	const boardArray = placementToBoard(placement);
	
	// Convert 8x8 array to Board object
	const board: Board = {} as Board;
	const pieces: Piece[] = [];
	
	// Files are a-h (0-7), Ranks are 1-8 (0-7)
	const files: Array<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	
	// Track piece counts for unique ID generation
	const pieceCounts: Record<string, number> = {};
	
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
				
				// Generate unique ID for this piece
				pieceCounts[pieceId] = (pieceCounts[pieceId] || 0) + 1;
				const uniqueId = `${pieceId}_${pieceCounts[pieceId]}`;
				
				// Calculate 3D position from square coordinates
				// FEN ranks: rank 0 in array = rank 8 in chess, rank 7 in array = rank 1 in chess
				// So we need to invert the rank calculation
				const position = {
					x: file - 4,
					y: -0.4,
					z: (7 - rank) - 4  // Invert rank: rank 0 -> z = 3, rank 7 -> z = -4
				};
				
				const pieceObject: Piece = { 
					id: uniqueId, 
					pieceId: pieceId,
					position: position
				};
				
				board[squareId] = pieceObject;
				pieces.push(pieceObject);
			}
		}
	}
	
	return { board, pieces };
}

/**
 * @description Apply a move to the board state by manipulating existing pieces
 * @param board - The current board state
 * @param pieces - The current pieces array
 * @param move - The move to apply
 * @returns Updated board state and pieces array
 */
export const applyMoveToBoard = (board: Board, pieces: Piece[], move: { from: SquareId; to: SquareId; promotion?: string }, chessResult?: any): { board: Board; pieces: Piece[] } => {
	// Create a copy of the board and pieces
	const newBoard = { ...board };
	const newPieces = [...pieces];
	
	// Get the piece that's moving
	const movingPiece = newBoard[move.from];
	if (!movingPiece) {
		throw new Error(`No piece found at ${move.from}`);
	}
	
	// Helper function to calculate position from square
	const calculatePosition = (squareId: SquareId) => {
		const fileToNumber = (file: string) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file);
		const file = fileToNumber(squareId.charAt(0));
		const chessRank = parseInt(squareId.charAt(1)); // This is the FEN rank (1-8)
		const arrayRank = 8 - chessRank; // Convert FEN rank to array rank
		return {
			x: file - 4,
			y: -0.4,
			z: (7 - arrayRank) - 4
		};
	};
	
	// Calculate new position from target square
	const newPosition = calculatePosition(move.to);
	
	// Create updated piece with new position
	const updatedPiece = {
		...movingPiece,
		position: newPosition
	};
	
	// Update piece in pieces array
	const pieceIndex = newPieces.findIndex(p => p.id === movingPiece.id);
	if (pieceIndex !== -1) {
		newPieces[pieceIndex] = updatedPiece;
	}
	
	// Handle capture first (before moving the piece)
	if (chessResult && chessResult.captured) {
		let capturedSquare: SquareId;
		
		if (chessResult.flags && chessResult.flags.includes('e')) {
			// En passant capture - use the correct logic from chess.js result
			const file = chessResult.to[0];                       // 'd'
			const rank = parseInt(chessResult.to[1], 10);         // 6
			const capturedRank = chessResult.color === 'w' ? rank - 1 : rank + 1;
			capturedSquare = `${file}${capturedRank}` as SquareId;
		} else {
			// Regular capture - captured piece is on target square
			capturedSquare = move.to as SquareId;
		}
		
		// Remove captured piece from board and pieces array
		const capturedPiece = newBoard[capturedSquare];
		if (capturedPiece) {
			newBoard[capturedSquare] = null;
			const capturedPieceIndex = newPieces.findIndex(p => p.id === capturedPiece.id);
			if (capturedPieceIndex !== -1) {
				newPieces.splice(capturedPieceIndex, 1);
			}
		}
	}
	
	// Move the piece to the new square
	newBoard[move.to] = updatedPiece;
	newBoard[move.from] = null;
	
	// Handle castling
	const isCastling = movingPiece.pieceId === 'wk' || movingPiece.pieceId === 'bk';
	if (isCastling) {
		const isKingSideCastling = move.to === 'g1' || move.to === 'g8';
		const isQueenSideCastling = move.to === 'c1' || move.to === 'c8';
		
		if (isKingSideCastling) {
			// King-side castling: move rook from h1/h8 to f1/f8
			const rookFrom = movingPiece.pieceId === 'wk' ? 'h1' : 'h8';
			const rookTo = movingPiece.pieceId === 'wk' ? 'f1' : 'f8';
			const rook = newBoard[rookFrom as SquareId];
			
			if (rook) {
				const rookNewPosition = calculatePosition(rookTo as SquareId);
				const updatedRook = {
					...rook,
					position: rookNewPosition
				};
				
				// Update rook in pieces array
				const rookIndex = newPieces.findIndex(p => p.id === rook.id);
				if (rookIndex !== -1) {
					newPieces[rookIndex] = updatedRook;
				}
				
				newBoard[rookTo as SquareId] = updatedRook;
				newBoard[rookFrom as SquareId] = null;
			}
		} else if (isQueenSideCastling) {
			// Queen-side castling: move rook from a1/a8 to d1/d8
			const rookFrom = movingPiece.pieceId === 'wk' ? 'a1' : 'a8';
			const rookTo = movingPiece.pieceId === 'wk' ? 'd1' : 'd8';
			const rook = newBoard[rookFrom as SquareId];
			
			if (rook) {
				const rookNewPosition = calculatePosition(rookTo as SquareId);
				const updatedRook = {
					...rook,
					position: rookNewPosition
				};
				
				// Update rook in pieces array
				const rookIndex = newPieces.findIndex(p => p.id === rook.id);
				if (rookIndex !== -1) {
					newPieces[rookIndex] = updatedRook;
				}
				
				newBoard[rookTo as SquareId] = updatedRook;
				newBoard[rookFrom as SquareId] = null;
			}
		}
	}
	
	// Handle promotion if specified
	if (move.promotion && updatedPiece) {
		const color = updatedPiece.pieceId.charAt(0) as 'w' | 'b';
		const promotedPieceId = `${color}${move.promotion}` as PieceId;
		const promotedPiece = {
			...updatedPiece,
			pieceId: promotedPieceId
		};
		
		// Update promoted piece in pieces array
		const pieceIndex = newPieces.findIndex(p => p.id === updatedPiece.id);
		if (pieceIndex !== -1) {
			newPieces[pieceIndex] = promotedPiece;
		}
		
		newBoard[move.to] = promotedPiece;
	}
	
	return { board: newBoard, pieces: newPieces };
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

/**
 * @description Get rotation vector for a chess piece based on its type and color
 * @param pieceId - The piece ID in format 'wp', 'bk', etc. (color + type)
 * @returns Rotation vector [x, y, z] in radians
 */
export const getPieceRotation = (pieceId: PieceId): [number, number, number] => {
	const color = pieceId[0] as 'w' | 'b';
	const type = pieceId[1] as 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
	
	// Base rotations for each piece type
	switch (type) {
		case 'p': // Pawn
			return [0, 0, 0];
			
		case 'r': // Rook
			return [0, 0, 0];
			
		case 'n': // Knight
			return [-Math.PI / 2, 0, color === 'w' ? Math.PI / 2 : -Math.PI / 2];
			
		case 'b': // Bishop
			return [-Math.PI / 2, 0, 0];
			
		case 'q': // Queen
			return [0, Math.PI / 2, 0];
			
		case 'k': // King
			return [-Math.PI / 2, 0, 0];
			
		default:
			return [0, 0, 0];
	}
};
