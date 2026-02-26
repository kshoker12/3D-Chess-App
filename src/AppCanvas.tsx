import { useRef } from 'react';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Board from './components/Board';
import Board2D from './components/Board2D';
import CameraController from './components/CameraController';
import Table from './components/Table';
import GameUI from './components/GameUI';
import GameModeMenu from './components/GameModeMenu';
import { RootState } from './store/store';

const AppCanvas = () => {
	const orbitRef = useRef<any>(null);
	const viewMode = useSelector((state: RootState) => state.ui.viewMode);

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<GameModeMenu />
			<GameUI />
			{viewMode === '2d' ? (
				<div
					className="absolute inset-0 flex flex-col"
					style={{ ['--banner-height' as string]: '100px' }}
				>
					{/* Spacer so main pane starts below the banner */}
					<div className="flex-shrink-0 h-[var(--banner-height)]" aria-hidden />
					<div className="flex-1 min-h-0 w-full relative">
						<Board2D />
					</div>
				</div>
			) : (
				<Canvas
					style={{ height: '100vh', width: '100vw' }}
					gl={{ preserveDrawingBuffer: true }}
					camera={{ position: [0, 7, -7], fov: 60 }}
					dpr={[1, 2]}
					performance={{ min: 0.5 }}
				>
					<Suspense fallback={null}>
						<Stars />
						<CameraController orbitRef={orbitRef} />
						<OrbitControls
							ref={orbitRef}
							maxPolarAngle={Math.PI / 2}
							minPolarAngle={-Math.PI / 2}
							minDistance={5}
							maxDistance={20}
							enablePan={true}
							enableZoom={true}
							enableRotate={true}
						/>
						<ambientLight intensity={4} />
						<directionalLight intensity={4} position={[0, 0, 10]} rotation={[0, Math.PI, 0]} />
						<directionalLight intensity={4} position={[0, 0, -10]} rotation={[0, 0, 0]} />
						<directionalLight intensity={1} position={[0, 10, 7]} />
						<Board />
						<Table />
					</Suspense>
				</Canvas>
			)}
		</div>
	);
};

export default AppCanvas;
