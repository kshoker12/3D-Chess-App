import { Box, useTexture } from '@react-three/drei';
import React, { useContext } from 'react';
import { ChessContext } from '../context/ChessContext';
import Piece from './Piece';

// const BoardSquare = ({texture, pos, wood}) => {
//     const { dispatch, selectedPiece, teams} = useContext(ChessContext);
//     const whiteTexture = useTexture("./whiteface.jpeg")
    
//     if (selectedPiece.selected && teams[selectedPiece.team].pieces[selectedPiece.index].pos.x === pos.x && teams[selectedPiece.team].pieces[selectedPiece.index].pos.y === pos.y ) {
//         return (
//             <Box args = {[1, 0.4, 1]} position = {[pos.x - 4, -0.2, pos.y - 4]} onClick={(e)=>{
//                 e.stopPropagation();
//                 if (selectedPiece.selected) {
//                     let bool = true;
//                     teams[selectedPiece.team].pieces.map((piece)=>{
//                         if (piece.pos.x === pos.x && piece.pos.y === pos.y) {
//                             bool = false;
//                         }
//                     })
//                     if (bool) {
//                         dispatch({
//                             type: "SET_TARGET",
//                             payload: {x: pos.x, y: pos.y}
//                         })    
//                     }
//                 }
//             }}>
//                 <meshStandardMaterial color={"grey"} attach={"material-0"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-1"} map={wood}/>
//                 <meshStandardMaterial color={"lime"} attach={"material-2"} map={whiteTexture}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-3"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-4"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-5"} map={wood}/>
//             </Box>    
//         )    
//     } else {
//         return (
//             <Box args = {[1, 0.4, 1]} position = {[pos.x - 4, -0.2, pos.y - 4]} onClick={(e)=>{
//                 e.stopPropagation();
//                 if (selectedPiece.selected) {
//                     let bool = true;
//                     let index = -1;
//                     teams[selectedPiece.team].pieces.map((piece, i)=>{
//                         if (piece.visible && piece.pos.x === pos.x && piece.pos.y === pos.y) {
//                             bool = false;
//                             index = i;
//                         }
//                     })
//                     if (bool) {
//                         dispatch({
//                             type: "SET_TARGET",
//                             payload: {x: pos.x, y: pos.y}
//                         })    
//                     } else {
//                         dispatch({
//                             type: "SET_PIECES",
//                             payload: {team: selectedPiece.team, index: index}
//                         })
//                     }
//                 }
//             }}>
//                 <meshStandardMaterial color={"grey"} attach={"material-0"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-1"} map={wood}/>
//                 <meshStandardMaterial color={pos.x  === 0 && pos.y === 0 ? "green" : "white"} attach={"material-2"} map={texture}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-3"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-4"} map={wood}/>
//                 <meshStandardMaterial color={"grey"} attach={"material-5"} map={wood}/>
//             </Box>    
//         ) 
//     }
    
// }
    
    
// const Board = () => {
//     const white = useTexture("./whiteface.jpeg");
//     const brown = useTexture("./brownface.jpeg");
//     const wood = useTexture("./woodTexture.jpeg")

//     return (
//         Array(8).fill(null).map((_, index)=>(
//             Array(8).fill(null).map((_, sIndex)=>(
//                 <BoardSquare key = {index + sIndex * 8} texture = {index % 2 === 0 ? sIndex % 2 === 1 ? brown : white : sIndex % 2 === 0 ? brown : white} pos = {{x: sIndex, y: index}} wood = {wood}/>
//             ))
//         )
//     ))
// }

const findPiece = (boardPiece, teams) => {
    let index = -1;
    let piece = null;
    if (boardPiece) {
        teams[boardPiece.team].pieces.map((p, i)=>{
            if (p.code === boardPiece.piece) {
                piece = p;
                index = i;
            }
        })
    }
    return {index, piece}
}

const CreatePiece = ({boardPiece, pos}) => {
    const { teams } = useContext(ChessContext)
    
    const {piece, index} = findPiece(boardPiece, teams);

    if (piece !== null) {
        return <Piece piece={piece} index={index} team={teams[boardPiece.team].id}/>    
    }   
}

const BoardSquare = ({texture, pos, wood, boardPiece}) => {
    const { dispatch, selectedPiece, teams, turn} = useContext(ChessContext);
    const whiteTexture = useTexture("./whiteface.jpeg")
            
    if (selectedPiece.selected && teams[selectedPiece.team].pieces[selectedPiece.index].pos.x === pos.x && teams[selectedPiece.team].pieces[selectedPiece.index].pos.y === pos.y ) {
        return (
            <>
                <Box args = {[1, 0.4, 1]} position = {[pos.x - 4, -0.6, pos.y - 4]} onClick={(e)=>{
                    e.stopPropagation();
                    if (selectedPiece.selected) {
                        let bool = true;
                        teams[selectedPiece.team].pieces.map((piece)=>{
                            if (piece.pos.x === pos.x && piece.pos.y === pos.y) {
                                bool = false;
                            }
                        })
                        if (bool) {
                            dispatch({
                                type: "SET_TARGET",
                                payload: {x: pos.x, y: pos.y}
                            })    
                        }
                    } else {
                        if (boardPiece.object && boardPiece.object.team === turn) {
                            dispatch({
                                type: "SET_PIECES",
                                payload: {team: turn, index: findPiece(boardPiece.object, teams).index}
                            })
                        }
                    }
                }}>
                    <meshStandardMaterial color={"grey"} attach={"material-0"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-1"} map={wood}/>
                    <meshStandardMaterial color={"lime"} attach={"material-2"} map={whiteTexture}/>
                    <meshStandardMaterial color={"grey"} attach={"material-3"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-4"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-5"} map={wood}/>
                </Box>    
                <CreatePiece boardPiece = {boardPiece.object} pos={pos}/>
            </>
            
        )    
    } else {
        return (
            <>
                <Box args = {[1, 0.4, 1]} position = {[pos.x - 4, -0.6, pos.y - 4]} onClick={(e)=>{
                    e.stopPropagation();
                    if (selectedPiece.selected) {
                        let bool = true;
                        let index = -1;
                        teams[selectedPiece.team].pieces.map((piece, i)=>{
                            if (piece.visible && piece.pos.x === pos.x && piece.pos.y === pos.y) {
                                bool = false;
                                index = i;
                            }
                        })
                        if (bool) {
                            dispatch({
                                type: "SET_TARGET",
                                payload: {x: pos.x, y: pos.y}
                            })    
                        } else {
                            dispatch({
                                type: "SET_PIECES",
                                payload: {team: selectedPiece.team, index: index}
                            })
                        }
                    } else {
                        if (boardPiece.object && boardPiece.object.team === turn) {
                            dispatch({
                                type: "SET_PIECES",
                                payload: {team: turn, index: findPiece(boardPiece.object, teams).index}
                            })
                        }
                    }
                }}>
                    <meshStandardMaterial color={"grey"} attach={"material-0"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-1"} map={wood}/>
                    <meshStandardMaterial color={"white"} attach={"material-2"} map={texture}/>
                    <meshStandardMaterial color={"grey"} attach={"material-3"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-4"} map={wood}/>
                    <meshStandardMaterial color={"grey"} attach={"material-5"} map={wood}/>
                </Box>  
                <CreatePiece boardPiece = {boardPiece.object} pos={pos}/>
            </>
              
        ) 
    }
    
    
}
    
    
const Board = () => {
    const { board } = useContext(ChessContext);
    const white = useTexture("./whiteface.jpeg");
    const brown = useTexture("./brownface.jpeg");
    const wood = useTexture("./woodTexture.jpeg");


    return (
        board.map((row1, rowIndex)=>{
            return row1.map((col1, colIndex)=>{
                return <BoardSquare key={colIndex * 8 + rowIndex} boardPiece = {col1} pos = {{y: rowIndex, x: colIndex}} wood = {wood} texture = {rowIndex % 2 === 0 ? colIndex % 2 === 1 ? brown : white : colIndex % 2 === 0 ? brown : white}/>
            })
        })
    )
}


export default Board