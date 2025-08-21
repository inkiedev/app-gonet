import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  uid: number | null;
  password: string | null;
  username: string | null;
  rememberMe: boolean;
  needsBiometricVerification: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  uid: null,
  password: null,
  username: null,
  rememberMe: false,
  needsBiometricVerification: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{
      uid: number;
      password: string;
      username: string;
      rememberMe: boolean;
    }>) => {
      state.isAuthenticated = true;
      state.uid = action.payload.uid;
      state.password = action.payload.password;
      state.username = action.payload.username;
      state.rememberMe = action.payload.rememberMe;
      state.needsBiometricVerification = false;
    },
    restoreSession: (state, action: PayloadAction<{
      uid: number;
      password: string;
      username: string;
      rememberMe: boolean;
    }>) => {
      state.isAuthenticated = true;
      state.uid = action.payload.uid;
      state.password = action.payload.password;
      state.username = action.payload.username;
      state.rememberMe = action.payload.rememberMe;
      state.needsBiometricVerification = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.uid = null;
      state.password = null;
      state.username = null;
      state.rememberMe = false;
      state.needsBiometricVerification = false;
    },
    sessionLogout: (state) => {
      state.isAuthenticated = false;
      if (!state.rememberMe) {
        state.uid = null;
        state.password = null;
        state.username = null;
        state.rememberMe = false;
        state.needsBiometricVerification = false;
      }
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
    },
    completeBiometricVerification: (state) => {
      state.needsBiometricVerification = false;
    },
  },
});

export const { loginSuccess, restoreSession, logout, sessionLogout, clearSession, completeBiometricVerification } = authSlice.actions;
export default authSlice.reducer;