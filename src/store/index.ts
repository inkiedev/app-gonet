import authSlice from '@/store/slices/auth-slice';
import userSlice from '@/store/slices/user-slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;