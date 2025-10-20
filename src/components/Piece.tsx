import { useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ChessContext } from '../context/ChessContext';
import { useSpring, a } from '@react-spring/three';

const Piece = ({ piece, team, index }) => {
	const { dispatch, selectedPiece, target } = useContext(ChessContext);
	const [prevPos, setPrevPos] = useState({ x: piece.pos.x - 4, y: piece.pos.y - 4 });

	const peakHeight = piece.type === 'Knight' ? 1.1 : 0;

	const { position } =
		piece.type === 'Knight'
			? useSpring({
					from: { position: [prevPos.x, -0.4, prevPos.y] },
					to: async (next) => {
						if (selectedPiece.index === index && selectedPiece.team === team && target) {
							await next({ position: [piece.pos.x - 4, peakHeight, piece.pos.y - 4] });
							await next({ position: [piece.pos.x - 4, -0.4, piece.pos.y - 4] });
							dispatch({
								type: 'FINISH_MOVEMENT',
							});
						}
					},
					config: { tension: 250, friction: 26 },
				})
			: useSpring({
					position: [piece.pos.x - 4, -0.4, piece.pos.y - 4],
					config: { tension: 170, friction: 26 },
					onRest: () => dispatch({ type: 'FINISH_MOVEMENT' }),
				});

	if (piece.visible) {
		return (
			<a.mesh position={position}>
				<group>
					<primitive
						object={piece.obj}
						position={[0, 0, 0]}
						scale={1}
						rotation={piece.rot}
						onClick={(e) => {
							e.stopPropagation();
							if (selectedPiece.selected && selectedPiece.team === team) {
								dispatch({
									type: 'SET_PIECES',
									payload: { team: team, index: index },
								});
							} else if (selectedPiece.selected) {
								// piece.visible = false;
								dispatch({
									type: 'SET_TARGET',
									payload: { x: piece.pos.x, y: piece.pos.y },
								});
							} else {
								dispatch({
									type: 'SET_PIECES',
									payload: { team: team, index: index },
								});
							}
						}}
					/>
				</group>
			</a.mesh>
		);
	} else {
		return <></>;
	}
};

export default Piece;
