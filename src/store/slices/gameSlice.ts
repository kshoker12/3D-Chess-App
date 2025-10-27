import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GameState, GameStatus, Move } from "../../types/gameTypes";
import { START_FEN } from "../../utils/fen";
import { AppDispatch, RootState } from "../store";
import { Chess } from "chess.js";
import { capturePiece, setFenParts, startGame, setBotThinking, setGameMode } from "./uiSlice";
import { GameMode } from "../../types/uiTypes";
import { Piece, PieceType } from "../../types/boardTypes";
import { applyMove, setLastMove, setMovingPiece, setSelectedSquare } from "./boardSlice";
import { parseFen } from "../../utils/fen";
import { fetchBotMove, MoveResponse } from "../api/botApi";

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

export const makeBotMove = createAsyncThunk<
    {status: GameStatus; fen: string},
    void,
    { state: RootState, dispatch: AppDispatch }
>('game/makeBotMove', async (_, {dispatch, getState}) => {
    let botResponse: MoveResponse | null = null;
    try {
        dispatch(setBotThinking(true));
        
        const currentFen = getState().game.history[getState().game.history.length - 1];
        const botDifficulty = getState().ui.botDifficulty || 'medium';
        botResponse = await fetchBotMove(currentFen, botDifficulty);
        
        // Parse move string (e.g., "e2e4" or "e7e8q" for promotion)
        const moveString = botResponse.best_move;
        if (moveString.length < 4 || moveString.length > 5) {
            throw new Error(`Invalid move format: ${moveString}`);
        }
        
        const move: Move = {
            from: moveString.substring(0, 2) as any,
            to: moveString.substring(2, 4) as any
        };
        
        // Handle promotion moves (5 characters: e7e8q)
        if (moveString.length === 5) {
            const promotionPiece = moveString.charAt(4).toUpperCase();
            move.promotion = promotionPiece as any;
        }
        
        // Dispatch the move using existing makeMove logic
        const result = await dispatch(makeMove(move));
        
        dispatch(setBotThinking(false));
        
        // Check if the move was successful
        if (result.meta.requestStatus === 'rejected') {
            throw new Error(`Move execution failed: ${result.payload}`);
        }
        
        return result.payload as {status: GameStatus; fen: string};
    } catch (error) {
        dispatch(setBotThinking(false));
        console.error('Bot move failed:', error);
        console.error('Move string that failed:', botResponse?.best_move);
        console.error('Current FEN:', getState().game.history[getState().game.history.length - 1]);
        
        // Fallback to pass-and-play mode
        dispatch(setGameMode(GameMode.PASS_AND_PLAY));
        
        // Return current state on error
        const currentFen = getState().game.history[getState().game.history.length - 1];
        return {status: GameStatus.PLAYING, fen: currentFen};
    }
});

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