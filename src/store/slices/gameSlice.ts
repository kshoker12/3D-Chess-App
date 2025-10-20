import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GameState, GameStatus } from "../../types/gameTypes";
import { START_FEN } from "../../utils/fen";
import { AppDispatch, RootState } from "../store";
import { Chess, Move } from "chess.js";
import { capturePiece } from "./uiSlice";
import { PieceType } from "../../types/boardTypes";
import { setBoardStateFromFen, setLastMove, setSelectedSquare } from "./boardSlice";

const initialState: GameState = {
    history: [START_FEN],
    playIndex: 0,
    status: GameStatus.PLAYING,
}

export const makeMove = createAsyncThunk<
    {status: GameStatus; fen: string},
    Move,
    { state: RootState, dispatch: AppDispatch }
>('game/makeMove', (move, {dispatch, getState }) => {
    const currentFen = getState().game.history[getState().game.history.length - 1];
    const chess = new Chess(currentFen);

    try {
        const result = chess.move(move);
        if (!result) throw new Error('Invalid move');
        const newFen = chess.fen();
        if (result.captured) {
            dispatch(capturePiece({team: result.color === 'w' ? 'w' : 'b', pieceType: result.captured as PieceType}));
        }
        dispatch(setLastMove({from: move.from, to: move.to, promotion: move.promotion as PieceType | undefined}));
        dispatch(setBoardStateFromFen(newFen));
        dispatch(setSelectedSquare(null));
        return {status: GameStatus.PLAYING, fen: newFen};
    } catch (error) {
        dispatch(setSelectedSquare(null));
        return {status: GameStatus.ERROR, fen: currentFen};
    }
})

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGame: (state) => {
            state.history = [START_FEN];
            state.playIndex = 0;
            state.status = GameStatus.PLAYING;
        },
        prevMove: (state) => {
            state.playIndex = Math.max(state.playIndex - 1, 0);
        }, 
        nextMove: (state) => {
            state.playIndex = Math.min(state.playIndex + 1, state.history.length - 1);
        },
        currentMove: (state) => {
            state.playIndex = state.history.length - 1;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(makeMove.fulfilled, (state, action) => {
            state.history.push(action.payload.fen);
            state.playIndex = state.history.length - 1;
            state.status = action.payload.status;
        });
        builder.addCase(makeMove.rejected, (state) => {
            state.status = GameStatus.PLAYING;
        });
    },
});

export const { resetGame, prevMove, nextMove, currentMove } = gameSlice.actions;
export default gameSlice.reducer;