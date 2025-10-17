import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// OVERVIEW: Load chess piece
// - index: index of type of piece
// - suit: color of chess piece
function LoadChessPiece(index, suit, title) {
    const chessModel = useGLTF(suit ===  "white" ? "./models/chess_white.glb" : "./models/chess_black.glb")

    // const piece = chessModel.scene.clone().children[0].children[0].children[0].children[index];
    const piece = chessModel.nodes[title].clone();
    piece.children[0].material.color = new THREE.Color(suit === "white" ? "white": 0x555555)

    return piece
}

// Pieces Index List
// 0 -> Pawn
// 1 -> Queen
// 2 -> Rook
// 3 -> Knight
// 4 -> King
// 5 -> Bishop
function LoadChessTeam(suit) {
    const pieces = [];

    Array(8).fill(null).map((_,index)=>{
        const piece = {}
        piece["obj"] = LoadChessPiece(0, suit, "Pawn")
        piece["pos"] = {x: index, y: suit === "white" ? 1 : 6}
        piece["rot"] = [0, 0, 0]
        piece["visible"] = true;
        piece["type"] = "Pawn";
        piece["points"] = 1
        piece["code"] = "P" + ( 1 + index);
        pieces.push(piece)
    })

    Array(2).fill(null).map((_, index)=>{
        const piece = {}
        piece["obj"] = LoadChessPiece(2, suit, "Rook")
        piece["pos"] = {x: index === 0 ? 0 : 7, y: suit === "white" ? 0 : 7}
        piece["rot"] = [0, 0, 0];
        piece["visible"] = true;
        piece["type"] = "Rook";
        piece["points"] = 5
        piece["code"] = "R" + (1+index);
        pieces.push(piece)
    })

    Array(2).fill(null).map((_, index)=>{
        const piece = {}
        piece["obj"] = LoadChessPiece(3, suit, "Knight")
        piece["pos"] = {x: index === 0 ? 1 : 6, y: suit === "white" ? 0 : 7}
        piece["rot"] = [ -Math.PI / 2, 0, suit === "white" ? Math.PI / 2 : - Math.PI / 2]
        piece["visible"] = true;
        piece["type"] = "Knight"
        piece["points"] = 3
        piece["code"] = "N" + (index + 1);
        pieces.push(piece)
    })

    Array(2).fill(null).map((_, index)=>{
        const piece = {}
        piece["obj"] = LoadChessPiece(5, suit, "Bishop")
        piece["pos"] = {x: index === 0 ? 2 : 5, y: suit === "white" ? 0 : 7}
        piece["rot"] = [-Math.PI / 2, 0, 0]
        piece["visible"] = true;
        piece["type"] = "Bishop";
        piece["points"] = 3
        piece["code"] = "B" + (index + 1);
        pieces.push(piece)
    })

    Array(2).fill(null).map((_, index)=>{
        const piece = {}
        piece["obj"] = LoadChessPiece(index === 0 ? 1 : 4, suit, index === 0 ? "King" : "Queen")
        piece["pos"] = {x: index === 0 ? 3 : 4, y: suit === "white" ? 0 : 7}
        piece["rot"] = index === 1? [0, Math.PI / 2, 0] : [-Math.PI / 2,0, 0]
        piece["type"] = index === 0 ? "King" : "Queen"
        piece["visible"] = true;
        piece["points"] = piece.type === "King" ? Infinity : 9
        piece["code"] = piece.type === "King" ? "K" : "Q";
        pieces.push(piece)
    })

    return pieces;
}

export {LoadChessPiece, LoadChessTeam}