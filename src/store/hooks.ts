import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Custom dispatch hook to use the dispatch function to carry out actions */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** App selector used to create custom selectors to extract data */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;