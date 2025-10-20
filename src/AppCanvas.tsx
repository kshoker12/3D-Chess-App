import React, { useContext, useEffect, useRef } from 'react';
import { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Box, OrbitControls, Stars, useTexture } from '@react-three/drei';
import Board from './components/Board';
import { BoxGeometry, DirectionalLight, MeshStandardMaterial } from 'three';
import { ChessContext } from './context/ChessContext';
import Team from './components/Team';
import { useSpring, a } from '@react-spring/three';

const CameraController = ({ orbitRef }) => {
	const { turn } = useContext(ChessContext);
	const { camera, set } = useThree();

	// Positions for the camera based on the team's turn
	const positions = {
		0: { position: [0, 7, -7], target: [0, 0, 0] },
		1: { position: [0, 7, 7], target: [0, 0, 0] },
	};

	const { position } = useSpring({
		position: positions[turn].position,
		config: { mass: 1, tension: 200, friction: 50 },
		onChange: ({ value }) => {
			camera.position.set(...value.position);

			camera.lookAt(...positions[turn].target);
		},
	});

	useEffect(() => {
		set({ camera: camera });
		camera.lookAt(...positions[turn].target);
	}, [camera, turn, set, positions]);

	return null;
};

const Table = ({}) => {
	const tableTexture = useTexture('/table.jpeg');
	const floor = useTexture('/floor.jpeg');
	const wall = useTexture('/wall.jpeg');

	return (
		<>
			<Box args={[14, 1, 14]} position={[-0.5, -1.3, -0.5]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={tableTexture} />
			</Box>
			<Box args={[1, 20, 1]} position={[6, -11.8, 6]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={tableTexture} />
			</Box>
			<Box args={[1, 20, 1]} position={[-7, -11.8, 6]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={tableTexture} />
			</Box>
			<Box args={[1, 20, 1]} position={[6, -11.8, -7]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={tableTexture} />
			</Box>
			<Box args={[1, 20, 1]} position={[-7, -11.8, -7]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={tableTexture} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={tableTexture} />
			</Box>
			<Box args={[200, 1, 200]} position={[0, -22.3, 0]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={floor} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={floor} />
				<meshStandardMaterial color={'white'} attach={'material-2'} map={floor} />
				<meshStandardMaterial color={'white'} attach={'material-3'} map={floor} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={floor} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={floor} />
			</Box>
			<Box args={[1, 100, 200]} position={[100.5, 28.2, 0]}>
				<meshStandardMaterial color={'red'} attach={'material-0'} />
				<meshStandardMaterial color={'white'} attach={'material-1'} map={wall} />
				<meshStandardMaterial color={'lime'} attach={'material-2'} />
				<meshStandardMaterial color={'grey'} attach={'material-3'} />
				<meshStandardMaterial color={'red'} attach={'material-4'} />
				<meshStandardMaterial color={'grey'} attach={'material-5'} />
			</Box>
			<Box args={[200, 100, 1]} position={[0, 28.2, 100.5]}>
				<meshStandardMaterial color={'red'} attach={'material-0'} />
				<meshStandardMaterial color={'grey'} attach={'material-1'} />
				<meshStandardMaterial color={'lime'} attach={'material-2'} />
				<meshStandardMaterial color={'grey'} attach={'material-3'} />
				<meshStandardMaterial color={'red'} attach={'material-4'} />
				<meshStandardMaterial color={'white'} attach={'material-5'} map={wall} />
			</Box>
			<Box args={[200, 100, 1]} position={[0, 28.2, -100.5]}>
				<meshStandardMaterial color={'red'} attach={'material-0'} />
				<meshStandardMaterial color={'grey'} attach={'material-1'} />
				<meshStandardMaterial color={'lime'} attach={'material-2'} />
				<meshStandardMaterial color={'white'} attach={'material-3'} />
				<meshStandardMaterial color={'white'} attach={'material-4'} map={wall} />
				<meshStandardMaterial color={'grey'} attach={'material-5'} />
			</Box>
			<Box args={[1, 100, 200]} position={[-100.5, 28.2, 0]}>
				<meshStandardMaterial color={'white'} attach={'material-0'} map={wall} />
				<meshStandardMaterial color={'grey'} attach={'material-1'} />
				<meshStandardMaterial color={'lime'} attach={'material-2'} />
				<meshStandardMaterial color={'grey'} attach={'material-3'} />
				<meshStandardMaterial color={'red'} attach={'material-4'} />
				<meshStandardMaterial color={'grey'} attach={'material-5'} />
			</Box>
			<Box args={[200, 1, 200]} position={[0, 78.7, 0]}>
				<meshStandardMaterial color={'red'} attach={'material-0'} />
				<meshStandardMaterial color={'grey'} attach={'material-1'} />
				<meshStandardMaterial color={'lime'} attach={'material-2'} />
				<meshStandardMaterial color={'grey'} attach={'material-3'} />
				<meshStandardMaterial color={'grey'} attach={'material-4'} />
				<meshStandardMaterial color={'grey'} attach={'material-5'} />
			</Box>
		</>
	);
};

const Score = ({}) => {
	const { teams } = useContext(ChessContext);

	return (
		<>
			<div className="absolute w-fit top-0 left-0 m-4 z-50">
				{`White ${teams[0].points > teams[1].points ? '+ ' + (teams[0].points - teams[1].points) : ''}`}
			</div>
			<div className="absolute w-fit top-0 right-0 z-50 m-4 ">
				{`Black ${teams[1].points > teams[0].points ? '+ ' + (teams[1].points - teams[0].points) : ''}`}
			</div>
		</>
	);
};

const AppCanvas = () => {
	const orbitRef = useRef();

	return (
		<div className="w-screen h-screen">
			<Score />
			<Canvas className="w-full h-full" gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 7, -7], fov: 60 }}>
				<Suspense fallback={null}>
					<Stars />
					<CameraController orbitRef={orbitRef} />
					<OrbitControls
						ref={orbitRef}
						maxPolarAngle={Math.PI / 2}
						minPolarAngle={-Math.PI / 2}
						minDistance={5}
						maxDistance={20}
					/>
					{/* {teams.map((team)=>(
                        <Team team={team}/>
                    ))} */}
					<ambientLight intensity={4} />
					<directionalLight intensity={4} position={[0, 0, 10]} rotation={[0, Math.PI, 0]} />
					<directionalLight intensity={4} position={[0, 0, -10]} rotation={[0, 0, 0]} />
					<directionalLight intensity={1} position={[0, 10, 7]} />
					<Board />
					<Table />
				</Suspense>
			</Canvas>
		</div>
	);
};

export default AppCanvas;
