import { useRef, useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Board from './components/Board';
import Board2D from './components/Board2D';
import Board2DLayout from './components/Board2DLayout';
import CameraController from './components/CameraController';
import Table from './components/Table';
import GameUI from './components/GameUI';
import GameModeMenu from './components/GameModeMenu';
import { WebGLErrorBoundary } from './components/WebGLErrorBoundary';
import { AppDispatch, RootState } from './store/store';
import { setViewMode } from './store/slices/uiSlice';
import { isWebGLAvailable, WEBGL_UNAVAILABLE_MESSAGE } from './utils/webgl';

const webglSupported = isWebGLAvailable();

const AppCanvas = () => {
	const dispatch = useDispatch<AppDispatch>();
	const orbitRef = useRef<any>(null);
	const viewMode = useSelector((state: RootState) => state.ui.viewMode);
	const [webglFailed, setWebglFailed] = useState(false);
	const [showWebglNotice, setShowWebglNotice] = useState(false);

	const use2dBoard = viewMode === '2d' || !webglSupported || webglFailed;

	useEffect(() => {
		if (!webglSupported && viewMode === '3d') {
			dispatch(setViewMode('2d'));
			setShowWebglNotice(true);
		}
	}, [dispatch, viewMode]);

	const handleWebglFailure = () => {
		setWebglFailed(true);
		setShowWebglNotice(true);
		dispatch(setViewMode('2d'));
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<GameModeMenu />
			<GameUI
				webglSupported={webglSupported && !webglFailed}
				onWebglUnavailable={() => setShowWebglNotice(true)}
			/>
			{showWebglNotice && (
				<div className="absolute top-24 left-1/2 z-[60] w-[min(92vw,28rem)] -translate-x-1/2 rounded-xl border border-amber-400/40 bg-amber-950/90 px-4 py-3 text-sm text-amber-100 shadow-xl backdrop-blur-sm">
					<div className="flex items-start gap-3">
						<i className="fas fa-exclamation-triangle mt-0.5 text-amber-400" aria-hidden />
						<div className="min-w-0 flex-1">
							<p className="font-medium text-amber-50">3D mode unavailable</p>
							<p className="mt-1 text-amber-100/90">{WEBGL_UNAVAILABLE_MESSAGE}</p>
						</div>
						<button
							type="button"
							onClick={() => setShowWebglNotice(false)}
							className="shrink-0 rounded-lg px-2 py-1 text-amber-200/80 hover:bg-amber-400/10 hover:text-amber-50"
							aria-label="Dismiss"
						>
							<i className="fas fa-times" aria-hidden />
						</button>
					</div>
				</div>
			)}
			{use2dBoard ? (
				<Board2DLayout>
					<Board2D />
				</Board2DLayout>
			) : (
				<WebGLErrorBoundary onError={handleWebglFailure}>
					<Canvas
						style={{ height: '100vh', width: '100vw' }}
						gl={{
							preserveDrawingBuffer: true,
							powerPreference: 'high-performance',
							failIfMajorPerformanceCaveat: false,
						}}
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
				</WebGLErrorBoundary>
			)}
		</div>
	);
};

export default AppCanvas;
