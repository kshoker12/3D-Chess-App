import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { selectFenParts } from "../store/selectors/uiSelectors";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import { GameMode } from "../types/uiTypes";

export interface CameraControllerProps {
    orbitRef: React.RefObject<typeof OrbitControls>;
}

const CameraController: FC<CameraControllerProps> = ({ orbitRef: _orbitRef }) => {
    const turn = useAppSelector(selectFenParts).active;
    const gameMode = useAppSelector((state) => state.ui.gameMode);
    const playerColor = useAppSelector((state) => state.ui.playerColor);
	const { camera } = useThree();

	// Positions for the camera based on the team's turn    
	const positions = {
		'w': { position: [0, 7, -7], target: [0, 0, 0] },
		'b': { position: [0, 7, 7], target: [0, 0, 0] },
	};

	// Determine which position to use based on game mode
	const getCameraPosition = () => {
		if (gameMode === GameMode.VS_BOT && playerColor) {
			// In vs-bot mode, camera stays fixed based on player's color
			return positions[playerColor];
		} else {
			// In pass-and-play mode, camera follows the turn
			return positions[turn];
		}
	};

	const currentPosition = getCameraPosition();

	useSpring<{ position: [number, number, number] }>({
		position: currentPosition.position,
		config: { mass: 1, tension: 200, friction: 50 },
		onChange: ({ value }) => {
            const timer = setTimeout(() => {
			camera.position.set(...value.position as [number, number, number]);
				camera.lookAt(...currentPosition.target as [number, number, number]);
			}, 1000);
			return () => clearTimeout(timer);
		},
	});

	return null;
};

export default CameraController;