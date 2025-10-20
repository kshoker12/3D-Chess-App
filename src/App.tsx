import { ChessProvider } from './context/ChessContext';
import AppCanvas from './AppCanvas';
import { LoadChessTeam } from './utils/ChessHelper';

function App() {
	const teams = [LoadChessTeam('white'), LoadChessTeam('black')];

	return (
		<ChessProvider teams={teams}>
			<AppCanvas />
		</ChessProvider>
	);
}

export default App;