import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SquareId } from "../../types/boardTypes";

export const selectBoardState = (state: RootState) => state.board;

export const selectBoard = createSelector(selectBoardState, (boardState) => boardState.board);
export const selectPieces = createSelector(selectBoardState, (boardState) => boardState.pieces);
export const selectSelectedSquare = createSelector(selectBoardState, (boardState) => boardState.selectedSquare);
export const selectLegalSquares = createSelector(selectBoardState, (boardState) => boardState.legalSquares);
export const selectLastMove = createSelector(selectBoardState, (boardState) => boardState.lastMove);
export const selectMovingPiece = createSelector(selectBoardState, (boardState) => boardState.movingPiece);

// More granular selectors for better performance
export const selectMovingPieceId = createSelector(selectMovingPiece, (movingPiece) => movingPiece?.id);
export const selectLastMoveFrom = createSelector(selectLastMove, (lastMove) => lastMove?.from);
export const selectLastMoveTo = createSelector(selectLastMove, (lastMove) => lastMove?.to);
export const selectIsPieceMoving = (pieceId: string) => 
	createSelector(selectMovingPieceId, (movingPieceId) => movingPieceId === pieceId);

// Piece-specific selectors to prevent unnecessary re-renders
export const createPieceSpecificSelectors = (pieceId: string, squareId: SquareId) => ({
	// Only returns true if THIS specific piece is moving
	isMoving: createSelector(
		selectMovingPieceId,
		(movingPieceId) => movingPieceId === pieceId
	),
	// Only returns lastMove if THIS specific piece is involved
	relevantLastMove: createSelector(
		selectLastMove,
		selectMovingPieceId,
		(lastMove, movingPieceId) => 
			movingPieceId === pieceId ? lastMove : null
	),
	// Only returns true if THIS specific piece's square is selected
	isSelected: createSelector(
		selectSelectedSquare,
		(selectedSquare) => selectedSquare === squareId
	)
});

// Square-specific selectors to prevent unnecessary re-renders
export const createSquareSpecificSelectors = (squareId: SquareId) => ({
	// Only returns true if THIS specific square is selected
	isSelected: createSelector(
		selectSelectedSquare,
		(selectedSquare) => selectedSquare === squareId
	),
	// Only returns true if THIS specific square is a legal move
	isLegal: createSelector(
		selectLegalSquares,
		(legalSquares) => legalSquares.includes(squareId)
	)
});