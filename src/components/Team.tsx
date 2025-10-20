import React from 'react';
import Piece from './Piece';

const Team = ({ team }) => {
	return (
		<>
			{team.pieces.map((piece, index) => (
				<Piece piece={piece} team={team.id} index={index} />
			))}
		</>
	);
};

export default Team;
