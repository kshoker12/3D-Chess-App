import { useTexture } from '@react-three/drei';
import { FC, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectBoard } from '../store/selectors/boardSelectors';
import Square from './Square';
import { Rank, SQUARE_COLOURS, SquareId } from '../types/boardTypes';
import Pieces from './Pieces';
import { assetPath } from '../utils/assets';

const Board: FC = () => {
	const board = useAppSelector(selectBoard);
	const white = useTexture(assetPath('whiteface.jpeg'));
	const brown = useTexture(assetPath('brownface.jpeg'));
	const wood = useTexture(assetPath('woodTexture.jpeg'));

	// Memoize the square list to prevent recreation on every render
	const squares = useMemo(() => {
		return Object.keys(board).map((squareId) => {
			const file = squareId.charAt(0) as unknown as string;
			const rank = parseInt(squareId.charAt(1)) as unknown as Rank;
			return (
				<Square 
					key={squareId} 
					squareId={squareId as SquareId} 
					texture={SQUARE_COLOURS[file][rank] === 'white' ? white : brown} 
					wood={wood} 
					white={white}
				/>
			);
		});
	}, [board, white, brown, wood]);

	return (
		<>
			{squares}
			<Pieces />
		</>
	)
};

export default Board;
