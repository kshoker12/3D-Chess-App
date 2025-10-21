import { FC } from "react";
import { useAppSelector } from "../store/hooks";
import { selectFenParts } from "../store/selectors/uiSelectors";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring } from "@react-spring/three";

export interface CameraControllerProps {
    orbitRef: React.RefObject<typeof OrbitControls>;
}

const CameraController: FC<CameraControllerProps> = ({ orbitRef }) => {
    const turn = useAppSelector(selectFenParts).active;
	const { camera, set } = useThree();

	// Positions for the camera based on the team's turn    
	const positions = {
		'w': { position: [0, 7, -7], target: [0, 0, 0] },
		'b': { position: [0, 7, 7], target: [0, 0, 0] },
	};

	useSpring<{ position: [number, number, number] }>({
		position: positions[turn].position,
		config: { mass: 1, tension: 200, friction: 50 },
		onChange: ({ value }) => {
            const timer = setTimeout(() => {
			camera.position.set(...value.position as [number, number, number]);
				camera.lookAt(...positions[turn].target as [number, number, number]);
			}, 1000);
			return () => clearTimeout(timer);
		},
	});

	return null;
};

export default CameraController;