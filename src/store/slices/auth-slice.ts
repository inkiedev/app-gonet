import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { secureStorageService, BiometricPreferences } from '@/services/secure-storage';

export const loadBiometricPreferences = createAsyncThunk(
  'auth/loadBiometricPreferences',
  async () => {
    const preferences = await secureStorageService.getBiometricPreferences();
    return preferences;
  }
);

export const saveBiometricPreferences = createAsyncThunk(
  'auth/saveBiometricPreferences',
  async (preferences: BiometricPreferences) => {
    await secureStorageService.saveBiometricPreferences(preferences);
    return preferences;
  }
);

interface AuthState {
  isAuthenticated: boolean;
  uid: number | null;
  password: string | null;
  username: string | null;
  rememberMe: boolean;
  needsBiometricVerification: boolean;
  biometricPreferences: {
    useBiometricForPassword: boolean;
    useBiometricForLogin: boolean;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  uid: null,
  password: null,
  username: null,
  rememberMe: false,
  needsBiometricVerification: false,
  biometricPreferences: {
    useBiometricForPassword: false,
    useBiometricForLogin: false,
  },
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
      state.biometricPreferences = {
        useBiometricForPassword: false,
        useBiometricForLogin: false,
      };
      secureStorageService.clearBiometricPreferences();
    },
    sessionLogout: (state) => {
      state.isAuthenticated = false;
      if (!state.rememberMe) {
        state.uid = null;
        state.password = null;
        state.username = null;
        state.rememberMe = false;
        state.needsBiometricVerification = false;
        state.biometricPreferences = {
          useBiometricForPassword: false,
          useBiometricForLogin: false,
        };
        secureStorageService.clearBiometricPreferences();
      }
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
    },
    completeBiometricVerification: (state) => {
      state.needsBiometricVerification = false;
    },
    updateBiometricPreferences: (state, action: PayloadAction<{
      useBiometricForPassword?: boolean;
      useBiometricForLogin?: boolean;
    }>) => {
      if (action.payload.useBiometricForPassword !== undefined) {
        state.biometricPreferences.useBiometricForPassword = action.payload.useBiometricForPassword;
      }
      if (action.payload.useBiometricForLogin !== undefined) {
        state.biometricPreferences.useBiometricForLogin = action.payload.useBiometricForLogin;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBiometricPreferences.fulfilled, (state, action) => {
        if (action.payload) {
          state.biometricPreferences = action.payload;
        }
      })
      .addCase(saveBiometricPreferences.fulfilled, (state, action) => {
        state.biometricPreferences = action.payload;
      });
  },
});

export const { loginSuccess, restoreSession, logout, sessionLogout, clearSession, completeBiometricVerification, updateBiometricPreferences } = authSlice.actions;
export default authSlice.reducer;