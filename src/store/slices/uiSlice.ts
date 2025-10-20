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
        },
        b: {
            color: 'black',
            points: 0,
            capturedPieces: [],
        }
    }
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
        resetUI: (state) => {
            state = initialState;
        }
    }
});

export const { setFenParts, capturePiece, resetUI } = uiSlice.actions;
export default uiSlice.reducer;