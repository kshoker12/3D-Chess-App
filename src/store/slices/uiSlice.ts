import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FenParts, PIECE_VALUE, UIState, GameMode, BotDifficulty } from "../../types/uiTypes";
import { parseFen, START_FEN } from "../../utils/fen";
import { PieceType } from "../../types/boardTypes";

const initialState: UIState = {
    fenParts: parseFen(START_FEN),
    teams: {
        w: {
            color: 'white',
            points: 0,
            capturedPieces: [],
            timeRemaining: 600, // 10 minutes in seconds
        },
        b: {
            color: 'black',
            points: 0,
            capturedPieces: [],
            timeRemaining: 600, // 10 minutes in seconds
        }
    },
    gameStarted: false,
    timerInterval: null,
    gameMode: null,
    playerColor: null,
    botDifficulty: 'medium',
    showGameModeMenu: true,
    botThinking: false,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setFenParts: (state, action: PayloadAction<FenParts>) => {
            state.fenParts = action.payload;
        },
        capturePiece: (state, action: PayloadAction<{team: 'w' | 'b', pieceType: PieceType}>) => {
            const { team, pieceType } = action.payload;
            state.teams[team] = {
                ...state.teams[team],
                capturedPieces: [...state.teams[team].capturedPieces, pieceType],
                points: state.teams[team].points + PIECE_VALUE[pieceType],
            };
        },
        resetUI: () => {
            return {
                ...initialState,
                showGameModeMenu: true,
                gameMode: null,
                playerColor: null,
                botDifficulty: 'medium' as BotDifficulty,
            };
        },
        startGame: (state) => {
            state.gameStarted = true;
        },
        pauseGame: (state) => {
            state.gameStarted = false;
        },
        decrementTimer: (state, action: PayloadAction<'w' | 'b'>) => {
            const team = action.payload;
            if (state.teams[team].timeRemaining > 0) {
                state.teams[team].timeRemaining -= 1;
            }
        },
        resetTimers: (state) => {
            state.teams.w.timeRemaining = 600;
            state.teams.b.timeRemaining = 600;
        },
        setTimerInterval: (state, action: PayloadAction<NodeJS.Timeout | null>) => {
            state.timerInterval = action.payload;
        },
        setGameMode: (state, action: PayloadAction<GameMode>) => {
            state.gameMode = action.payload;
        },
        setPlayerColor: (state, action: PayloadAction<'w' | 'b'>) => {
            state.playerColor = action.payload;
        },
        setShowGameModeMenu: (state, action: PayloadAction<boolean>) => {
            state.showGameModeMenu = action.payload;
        },
        setBotThinking: (state, action: PayloadAction<boolean>) => {
            state.botThinking = action.payload;
        },
        setBotDifficulty: (state, action: PayloadAction<BotDifficulty>) => {
            state.botDifficulty = action.payload;
        }
    }
});

export const { setFenParts, capturePiece, resetUI, startGame, pauseGame, decrementTimer, resetTimers, setTimerInterval, setGameMode, setPlayerColor, setBotDifficulty, setShowGameModeMenu, setBotThinking } = uiSlice.actions;
export default uiSlice.reducer;