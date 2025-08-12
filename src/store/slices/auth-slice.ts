import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{
      token: string;
      refreshToken: string;
      expiresAt: number;
    }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
    },
    updateToken: (state, action: PayloadAction<{
      token: string;
      expiresAt: number;
    }>) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
  },
});

export const { loginSuccess, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;