import React, { FC, useMemo, memo } from 'react';
import { useSpring, a } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { store } from '../store/store';
import { createPieceSpecificSelectors } from '../store/selectors/boardSelectors';
import { getPieceRotation } from '../utils/ChessHelper';
import { PieceId, SquareId } from '../types/boardTypes';
import { setSelectedSquare, setMovingPiece } from '../store/slices/boardSlice';
import { Move } from '../types/gameTypes';
import { makeMove } from '../store/slices/gameSlice';
import { Piece as PieceType } from '../types/boardTypes';
import * as THREE from 'three';

export interface PieceProps {
	piece: PieceType;
	squareId: SquareId;
}

const Piece: FC<PieceProps> = memo(({ piece, squareId }) => {
	const dispatch = useAppDispatch();
	
	// Create piece-specific selectors that only trigger when THIS piece is affected
	const pieceSelectors = useMemo(() => createPieceSpecificSelectors(piece.id, squareId), [piece.id, squareId]);
	
	// Only subscribe to selectors that are relevant to this specific piece
	const isMoving = useAppSelector(pieceSelectors.isMoving);
	const relevantLastMove = useAppSelector(pieceSelectors.relevantLastMove);

	// Memoize expensive calculations
	const isKnight = useMemo(() => piece.pieceId.charAt(1) === 'n', [piece.pieceId]);
	const peakHeight = isKnight ? 1.1 : 0; // Increased height for more visible jump
	const rotation = useMemo(() => getPieceRotation(piece.pieceId as PieceId), [piece.pieceId]);

	// Extract piece type for explicit change detection
	const pieceType = useMemo(() => piece.pieceId.charAt(1), [piece.pieceId]);
	const pieceColor = useMemo(() => piece.pieceId.charAt(0), [piece.pieceId]);
	
	
	// Load the appropriate 3D model based on pieceId
	const pieceModel = useMemo(() => {
		const color = pieceColor as 'w' | 'b';
		const type = pieceType as 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
		
		const modelPath = color === 'w' ? './models/chess_white.glb' : './models/chess_black.glb';
		const chessModel = useGLTF(modelPath);
		
		// Just get the Queen node for promoted pieces, or the correct node for others
		let nodeName = 'Queen'; // Default to Queen for promoted pieces
		if (type !== 'q') {
			const pieceTypeMap: { [key: string]: string } = {
				'p': 'Pawn',
				'r': 'Rook', 
				'n': 'Knight',
				'b': 'Bishop',
				'k': 'King'
			};
			nodeName = pieceTypeMap[type] || 'Queen';
		}
		
		const model = chessModel.nodes[nodeName].clone();
		
		// Set the material color
		if (model.children && model.children[0]) {
			const child = model.children[0] as any;
			if (child.material) {
				child.material.color = new THREE.Color(color === 'w' ? 'white' : 0x555555);
			}
		}
		
		return model;
	}, [pieceType, pieceColor]);

	// Check if this piece should animate - memoized to prevent unnecessary recalculations
	const shouldAnimate = useMemo(() => {
		return isMoving && relevantLastMove;
	}, [isMoving, relevantLastMove]);

	// Current position from piece object - memoized
	const currentPosition = useMemo(() => 
		[piece.position.x, piece.position.y, piece.position.z] as [number, number, number],
		[piece.position.x, piece.position.y, piece.position.z]
	);
	
	// Calculate previous position from lastMove if this piece is moving - memoized
	const prevPosition = useMemo(() => {
		if (relevantLastMove && isMoving) {
			const fileToNumber = (file: string) => ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file);
			const fromX = fileToNumber(relevantLastMove.from.charAt(0));
			const chessRank = parseInt(relevantLastMove.from.charAt(1)); // FEN rank (1-8)
			const arrayRank = 8 - chessRank; // Convert to array rank
			return [fromX - 4, -0.4, (7 - arrayRank) - 4] as [number, number, number];
		}
		return currentPosition;
	}, [relevantLastMove, isMoving, currentPosition]);

	// Non-reactive click handler that reads current state at click time
	const handleClick = useMemo(() => (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		// Get current state at click time instead of subscribing to it
		const currentState = store.getState();
		const selectedSquare = currentState.board.selectedSquare;
		
		if (selectedSquare === squareId) {
			dispatch(setSelectedSquare(null));
		} else if (selectedSquare === null) {
			dispatch(setSelectedSquare(squareId));
		} else {
			const move: Move = { from: selectedSquare as SquareId, to: squareId as SquareId };
			dispatch(makeMove(move));
		}
	}, [squareId, dispatch]);

	const { position } = isKnight 
		? useSpring({
			from: { position: shouldAnimate ? prevPosition : currentPosition },
			to: async (next) => {
				if (shouldAnimate) {
					await next({ position: [currentPosition[0], peakHeight, currentPosition[2]] });
					await next({ position: currentPosition });
					dispatch(setSelectedSquare(null));
					dispatch(setMovingPiece(null));
				}
			},
			config: { tension: 250, friction: 26 },
		})
		: useSpring({
			position: currentPosition,
			config: { tension: 170, friction: 26 },
			immediate: !shouldAnimate,
			onRest: () => {
				if (shouldAnimate) {
					dispatch(setSelectedSquare(null));
					dispatch(setMovingPiece(null));
				}
			},
		});

	return (
		<a.mesh position={position as any}>
			<group>
				<primitive
					object={pieceModel}
					position={[0, 0, 0]}
					scale={1}
					rotation={rotation}
					onClick={handleClick}
				/>
			</group>
		</a.mesh>
	);
});

Piece.displayName = 'Piece';

export default Piece;
