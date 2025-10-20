import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectGameState = (state: RootState) => state.game;

export const selectGameHistory = createSelector(selectGameState, (gameState) => gameState.history);
export const selectGamePlayIndex = createSelector(selectGameState, (gameState) => gameState.playIndex);
export const selectGameStatus = createSelector(selectGameState, (gameState) => gameState.status);