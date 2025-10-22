import Piece from './Piece';
import { Piece as PieceType } from '../types/boardTypes';

interface TeamProps {
	team: {
		id: number;
		pieces: PieceType[];
	};
}

const Team = ({ team }: TeamProps) => {
	return (
		<>
			{team.pieces.map((piece: PieceType, index: number) => (
				<Piece key={piece.id} piece={piece} squareId={`a${index + 1}` as any} />
			))}
		</>
	);
};

export default Team;
