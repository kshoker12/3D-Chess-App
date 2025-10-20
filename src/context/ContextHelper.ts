function checkIfExists(state, teamId, pos) {
    state.teams[teamId].pieces.map((piece, index)=>{
        if (piece.visible && piece.pos.x === pos.x && piece.pos.y === pos.y ) {
            state.teams[teamId].pieces[index].visible = false;
            state.teams[teamId === 1 ? 0 : 1].points += piece.points
        }
    })
}

export { checkIfExists }