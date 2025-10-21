import { FC, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectPieces, selectBoard } from '../store/selectors/boardSelectors';
import Piece from './Piece';
import { SquareId } from '../types/boardTypes';

const Pieces: FC = () => {
	const pieces = useAppSelector(selectPieces);
	const board = useAppSelector(selectBoard);

	// Memoize the piece-square mapping to prevent recalculation on every render
	const pieceSquareMap = useMemo(() => {
		const map = new Map<string, SquareId>();
		for (const [squareId, boardPiece] of Object.entries(board)) {
			if (boardPiece) {
				map.set(boardPiece.id, squareId as SquareId);
			}
		}
		return map;
	}, [board]);

	// Memoize the rendered pieces to prevent unnecessary re-renders
	const renderedPieces = useMemo(() => {
		return pieces.map((piece) => {
			const squareId = pieceSquareMap.get(piece.id);
			if (!squareId) return null;
			
			return (
				<Piece 
					key={piece.id} 
					piece={piece} 
					squareId={squareId}
				/>
			);
		}).filter(Boolean);
	}, [pieces, pieceSquareMap]);

	return <>{renderedPieces}</>;
};

export default Pieces;
