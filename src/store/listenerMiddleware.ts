import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './store';
import { prevMove, nextMove, resetGame, currentMove } from './slices/gameSlice';
import { setBoardStateFromFen } from './slices/boardSlice';

export const listenerMiddleware = createListenerMiddleware();

// Helper function to handle playIndex changes
const handlePlayIndexChange = (action: any, listenerApi: any) => {
	const state = listenerApi.getState();
	const currentPlayIndex = state.game.playIndex;
	const currentFen = state.game.history[currentPlayIndex];

    listenerApi.dispatch(setBoardStateFromFen(currentFen));
	
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
