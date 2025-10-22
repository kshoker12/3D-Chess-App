import { useRef } from 'react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Board from './components/Board';
import CameraController from './components/CameraController';
import Table from './components/Table';
import GameUI from './components/GameUI';
import GameModeMenu from './components/GameModeMenu';

const AppCanvas = () => {
	const orbitRef = useRef<any>(null);

	return (
		<div style = {{height: '100%', width: '100%'}}>
			{/* <Debug /> */}
			<GameModeMenu />
			<GameUI />
			<Canvas style = {{height: '100vh', width: '100vw'}} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 7, -7], fov: 60 }}>
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
