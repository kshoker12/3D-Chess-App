import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectUIState = (state: RootState) => state.ui;

export const selectFenParts = createSelector(selectUIState, (uiState) => uiState.fenParts);
export const selectTeams = createSelector(selectUIState, (uiState) => uiState.teams);