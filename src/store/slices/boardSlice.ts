import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BoardState, SquareId } from "../../types/boardTypes";
import { createBoard, getLegalMoves } from "../../utils/ChessHelper";
import { START_FEN } from "../../utils/fen";
import { Move } from "../../types/gameTypes";
import { AppDispatch, RootState } from "../store";

const initialState: BoardState = {
    board: createBoard(START_FEN),
    selectedSquare: null,
    legalSquares: [],
    lastMove: null,
}

/**
 * @description Thunk to select a square and retrieve its legal moves using chess.js
 * @param squareId - The square to select and get legal moves for
 * @returns Promise that resolves to array of SquareId strings
 */
export const setSelectedSquare = createAsyncThunk<
    SquareId[],
    SquareId | null,
    { state: RootState; dispatch: AppDispatch }
>('board/selectSquare', (squareId, { getState }) => {
    const state = getState();
    const currentFen = state.game.history[state.game.history.length - 1];
    
    try {
        if (squareId === null) throw new Error();
        ;
        const legalMoves = getLegalMoves(currentFen, squareId as SquareId);
        return legalMoves;
    } catch (error) {
        console.error('Error fetching legal moves:', error);
        return [];
    }
});

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setLastMove: (state, action: PayloadAction<Move | null>) => {
            state.lastMove = action.payload;
        },
        setBoardStateFromFen: (state, action: PayloadAction<string>) => {
            state.board = createBoard(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setSelectedSquare.pending, (state, action) => {
                state.selectedSquare = action.meta.arg;
            })
            .addCase(setSelectedSquare.fulfilled, (state, action) => {
                state.legalSquares = action.payload;
            })
            .addCase(setSelectedSquare.rejected, (state) => {
                state.legalSquares = [];
                state.selectedSquare = null;
            });
    }
})

export const { setLastMove, setBoardStateFromFen } = boardSlice.actions;
export default boardSlice.reducer;