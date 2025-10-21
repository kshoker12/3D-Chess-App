import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FenParts, PIECE_VALUE, UIState } from "../../types/uiTypes";
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
            return initialState;
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
        }
    }
});

export const { setFenParts, capturePiece, resetUI, startGame, pauseGame, decrementTimer, resetTimers, setTimerInterval } = uiSlice.actions;
export default uiSlice.reducer;