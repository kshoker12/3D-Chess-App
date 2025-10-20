import { createContext, useReducer } from "react"
import * as HELPER from "./ContextHelper";

const ChessReducer = (state, action) => {
    switch (action.type) {
        case "SET_PIECES":
            action.type = "DONE";
            if (action.payload.team === state.turn) {
                
                state.selectedPiece = {selected: true, team: action.payload.team, index: action.payload.index}    
            }
            return {
                ...state
            }
        case "SET_TARGET":
            action.type = "DONE";
            state.target = action.payload;
            state.teams[state.selectedPiece.team].pieces[state.selectedPiece.index].pos = action.payload
            HELPER.checkIfExists(state, state.selectedPiece.team === 0 ? 1 : 0, state.target)
            return {
                ...state
            }
        case "FINISH_MOVEMENT":
            action.type = "DONE";
            
            state.selectedPiece = {selected:false, index: null, team: null}
            state.target = null;
            state.turn = state.turn === 0 ? 1 : 0
            return {
                ...state
            }
        default:
            return state;
    }
}

const ChessContext = createContext();

const initialState = {
    teams: [
        {id: 0, name: "white", pieces: [], color: 'grey', points: 0},
        {id: 1, name: "black", pieces: [], color: 'black', points: 0}
    ],
    selectedPiece: {selected: false, team: null, index: null},
    target: null,
    turn: 0,
    board: [
        [{name: "A1", object: {team: 0, piece: "R1"}}, {name: "B1", object: {team: 0, piece: "N1"}},{name: "C1", object: {team: 0, piece: "B1"}}, {name: "D1", object: {team: 0, piece: "K"}}, {name: "E1", object: {team: 0, piece: "Q"}}, {name: "F1", object: {team: 0, piece: "B2"}},{name: "G1", object: {team: 0, piece: "N2"}}, {name: "H1", object: {team: 0, piece: "R2"}}],
        [{name: "A2", object: {team: 0, piece: "P1"}}, {name: "B2", object: {team: 0, piece: "P2"}},{name: "C2", object: {team: 0, piece: "P3"}}, {name: "D2", object: {team: 0, piece: "P4"}}, {name: "E2", object: {team: 0, piece: "P5"}}, {name: "F2", object: {team: 0, piece: "P6"}},{name: "G2", object: {team: 0, piece: "P7"}}, {name: "H2", object: {team: 0, piece: "P8"}}],
        [{name: "A3", object: null}, {name: "B3", object: null},{name: "C3", object: null}, {name: "D3", object: null}, {name: "E3", object: null}, {name: "F3", object: null},{name: "G3", object: null}, {name: "H3", object: null}],
        [{name: "A4", object: null}, {name: "B4", object: null},{name: "C4", object: null}, {name: "D4", object: null}, {name: "E4", object: null}, {name: "F4", object: null},{name: "G4", object: null}, {name: "H4", object: null}],
        [{name: "A5", object: null}, {name: "B5", object: null},{name: "C5", object: null}, {name: "D5", object: null}, {name: "E5", object: null}, {name: "F5", object: null},{name: "G5", object: null}, {name: "H5", object: null}],
        [{name: "A6", object: null}, {name: "B6", object: null},{name: "C6", object: null}, {name: "D6", object: null}, {name: "E6", object: null}, {name: "F6", object: null},{name: "G6", object: null}, {name: "H6", object: null}],
        [{name: "A7", object: {team: 1, piece: "P1"}}, {name: "B7", object: {team: 1, piece: "P2"}},{name: "C7", object: {team: 1, piece: "P3"}}, {name: "D7", object: {team: 1, piece: "P4"}}, {name: "E7", object: {team: 1, piece: "P5"}}, {name: "F7", object: {team: 1, piece: "P6"}},{name: "G7", object: {team: 1, piece: "P7"}}, {name: "H7", object: {team: 1, piece: "P8"}}],
        [{name: "A8", object: {team: 1, piece: "R1"}}, {name: "B8", object: {team: 1, piece: "N1"}},{name: "C8", object: {team: 1, piece: "B1"}}, {name: "D8", object: {team: 1, piece: "K"}}, {name: "E8", object: {team: 1, piece: "Q"}}, {name: "F8", object: {team: 1, piece: "B2"}},{name: "G8", object: {team: 1, piece: "N2"}}, {name: "H8", object: {team: 1, piece: "R2"}}]
    ]
}

const ChessProvider = (props) => {
    initialState["teams"][0].pieces = props.teams[0];
    initialState["teams"][1].pieces = props.teams[1];
    const [state, dispatch] = useReducer(ChessReducer, initialState);

    return (
        <ChessContext.Provider
            value={{
                teams: state.teams,
                selectedPiece: state.selectedPiece, 
                target: state.target,
                turn: state.turn,
                board: state.board,
                dispatch
            }}
        >
            {props.children}
        </ChessContext.Provider>
    )
}

export {ChessContext, ChessProvider, ChessReducer}