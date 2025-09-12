import authSlice from '@/store/slices/auth-slice';
import uiSlice from '@/store/slices/ui-slice';
import adsSlice from '@/store/slices/ads-slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  auth: authSlice,
  ui: uiSlice,
  ads: adsSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;