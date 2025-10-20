import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectBoardState = (state: RootState) => state.board;

export const selectBoard = createSelector(selectBoardState, (boardState) => boardState.board);
export const selectSelectedSquare = createSelector(selectBoardState, (boardState) => boardState.selectedSquare);
export const selectLegalSquares = createSelector(selectBoardState, (boardState) => boardState.legalSquares);
export const selectLastMove = createSelector(selectBoardState, (boardState) => boardState.lastMove);