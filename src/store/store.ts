import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import game from './slices/gameSlice';
import board from './slices/boardSlice';
import ui from './slices/uiSlice';
import { listenerMiddleware } from './listenerMiddleware';

// allow using maps and sets inside store
enableMapSet();

export const store = configureStore({
	reducer: {
		board,
		game,
		ui,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['listenerMiddleware/startListening', 'listenerMiddleware/stopListening'],
			},
		}).prepend(listenerMiddleware.middleware),
});

/** Root state of the application which can be used in selectors to access data in store */
export type RootState = ReturnType<typeof store.getState>;

/** Dispatch function which carries out actions to modify data in store */
export type AppDispatch = typeof store.dispatch;