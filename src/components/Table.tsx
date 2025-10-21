import { Box, useTexture } from "@react-three/drei";
import { FC } from "react";

const Table: FC = () => {
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

export default Table;