import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BoardState, Piece, SquareId } from "../../types/boardTypes";
import { createBoard, getLegalMoves, applyMoveToBoard } from "../../utils/ChessHelper";
import { START_FEN } from "../../utils/fen";
import { Move } from "../../types/gameTypes";
import { AppDispatch, RootState } from "../store";

const initialBoardData = createBoard(START_FEN);
const initialState: BoardState = {
    board: initialBoardData.board,
    pieces: initialBoardData.pieces,
    selectedSquare: null,
    legalSquares: [],
    lastMove: null,
    movingPiece: null,
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
>('board/selectSquare', (squareId, { getState, rejectWithValue }) => {
    const state = getState();
    const currentFen = state.game.history[state.game.history.length - 1];
    const turn = state.ui.fenParts.active;
    
    try {
        if (squareId === null) throw new Error();
        if (state.board.board[squareId] === null) throw new Error();
        if (state.board.board[squareId].pieceId.charAt(0) !== turn) throw new Error();
        const legalMoves = getLegalMoves(currentFen, squareId as SquareId);
        return legalMoves;
    } catch (error) {
        return rejectWithValue([]);
    }
});

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setLastMove: (state, action: PayloadAction<Move | null>) => {
            state.lastMove = action.payload;
        },
        applyMove: (state, action: PayloadAction<{move: Move, chessResult: any}>) => {
            const result = applyMoveToBoard(state.board, state.pieces, action.payload.move, action.payload.chessResult);
            state.board = result.board;
            state.pieces = result.pieces;
        },
        setBoardFromFen: (state, action: PayloadAction<string>) => {
            const result = createBoard(action.payload);
            state.board = result.board;
            state.pieces = result.pieces;
        },
        setMovingPiece: (state, action: PayloadAction<Piece | null>) => {
            state.movingPiece = action.payload;
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

export const { setLastMove, applyMove, setBoardFromFen, setMovingPiece } = boardSlice.actions;
export default boardSlice.reducer;