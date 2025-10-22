import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './store';
import { prevMove, nextMove, resetGame, currentMove, makeMove, makeBotMove } from './slices/gameSlice';
import { setBoardFromFen } from './slices/boardSlice';
import { GameMode } from '../types/uiTypes';
import { GameStatus } from '../types/gameTypes';

export const listenerMiddleware = createListenerMiddleware();

// Helper function to handle playIndex changes
const handlePlayIndexChange = (_action: any, listenerApi: any) => {
	const state = listenerApi.getState();
	const currentPlayIndex = state.game.playIndex;
	const currentFen = state.game.history[currentPlayIndex];

    listenerApi.dispatch(setBoardFromFen(currentFen));
	
	// Add your arbitrary action here
	// For example, you could:
	// - Update UI state based on playIndex
	// - Make API calls
	// - Trigger animations
	// - Log to analytics
	// - Update other parts of the store
	
	// Example: Dispatch an action to update UI based on playIndex
	// listenerApi.dispatch(someOtherAction(currentPlayIndex));
	
	// You can also access the current state if needed:
	// const currentState = listenerApi.getState();
};

// Listen for actions that update the playIndex
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	matcher: isAnyOf(prevMove, nextMove, resetGame, currentMove),
	effect: handlePlayIndexChange,
});

// Listen for bot turns after moves are completed
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	matcher: makeMove.fulfilled.match,
	effect: async (_action, listenerApi) => {
		const state = listenerApi.getState();
		
		// Check if we should trigger bot move
		if (
			state.ui.gameMode === GameMode.VS_BOT &&
			state.ui.fenParts.active !== state.ui.playerColor &&
			(state.game.status === GameStatus.PLAYING || state.game.status === GameStatus.CHECK) &&
			!state.ui.botThinking
		) {
			// Small delay for better UX
			setTimeout(() => {
				listenerApi.dispatch(makeBotMove());
			}, 500);
		}
	},
});
