import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GameState, GameStatus, Move } from "../../types/gameTypes";
import { START_FEN } from "../../utils/fen";
import { AppDispatch, RootState } from "../store";
import { Chess } from "chess.js";
import { capturePiece, setFenParts, startGame } from "./uiSlice";
import { Piece, PieceType } from "../../types/boardTypes";
import { applyMove, setLastMove, setMovingPiece, setSelectedSquare } from "./boardSlice";
import { parseFen } from "../../utils/fen";

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
    // Make move only if move to square is not occupied by the active team
    if (getState().board.board[move.to]?.pieceId.charAt(0) === getState().ui.fenParts.active) {
        dispatch(setSelectedSquare(move.to));
        return {status: GameStatus.ERROR, fen: getState().game.history[getState().game.history.length - 1]};
    } else {
        const chess = new Chess(currentFen);
        try {
            let result;
            // Try the move first without promotion
            try {
                result = chess.move(move);
            } catch (error) {
                // If move fails and it's a pawn reaching the end, try with queen promotion
                const fromPiece = chess.get(move.from);
                if (fromPiece && fromPiece.type === 'p') {
                    const isWhitePawn = fromPiece.color === 'w';
                    const isReachingEnd = isWhitePawn ? move.to.charAt(1) === '8' : move.to.charAt(1) === '1';
                    
                    if (isReachingEnd) {
                        const moveWithPromotion = { ...move, promotion: 'q' };
                        result = chess.move(moveWithPromotion);
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }
            
            if (!result) throw new Error('Invalid move');
            const newFen = chess.fen();
            
            // Check game status after move
            let gameStatus = GameStatus.PLAYING;
            if (chess.isCheckmate()) {
                gameStatus = GameStatus.CHECKMATE;
            } else if (chess.isStalemate()) {
                gameStatus = GameStatus.STALEMATE;
            } else if (chess.isDraw()) {
                gameStatus = GameStatus.DRAW;
            } else if (chess.isCheck()) {
                gameStatus = GameStatus.CHECK;
            }
            
            if (result.captured) {
                dispatch(capturePiece({team: result.color === 'w' ? 'b' : 'w', pieceType: result.captured as PieceType}));
            }
            dispatch(setMovingPiece(getState().board.board[move.from] as Piece | null));
            // Create move object with promotion information from chess.js result
            const moveWithPromotion = {
                from: move.from,
                to: move.to,
                promotion: result.promotion ? result.promotion.toUpperCase() as PieceType : move.promotion
            };
            
            dispatch(setLastMove({from: move.from, to: move.to, promotion: result.promotion ? result.promotion.toUpperCase() as PieceType : undefined}));
            dispatch(applyMove({move: moveWithPromotion, chessResult: result}));
            dispatch(setFenParts(parseFen(newFen)));
            dispatch(setSelectedSquare(null));
            
            // Start the game timer if it's the first move
            if (!getState().ui.gameStarted) {
                dispatch(startGame());
            }
            
            return {status: gameStatus, fen: newFen};
        } catch (error) {
            dispatch(setSelectedSquare(null));
            return {status: GameStatus.ERROR, fen: currentFen};
        }    
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