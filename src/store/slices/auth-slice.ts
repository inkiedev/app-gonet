import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { secureStorageService, BiometricPreferences, UserData } from '@/services/secure-storage';

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

export const saveUserData = createAsyncThunk(
  'auth/saveUserData',
  async (userData: UserData) => {
    await secureStorageService.saveUserData(userData);
    return userData;
  }
);

export const loadUserData = createAsyncThunk(
  'auth/loadUserData',
  async () => {
    const userData = await secureStorageService.getUserData();
    return userData;
  }
);

export const loadRememberMe = createAsyncThunk(
  'auth/loadRememberMe',
  async () => {
    const rememberData = await secureStorageService.getRememberMe();
    return rememberData;
  }
);

export const saveRememberMe = createAsyncThunk(
  'auth/saveRememberMe',
  async ({ username, rememberMe }: { username: string; rememberMe: boolean }) => {
    await secureStorageService.saveRememberMe(username, rememberMe);
    return { username, rememberMe };
  }
);

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  rememberMe: boolean;
  needsBiometricVerification: boolean;
  biometricPreferences: {
    useBiometricForPassword: boolean;
    useBiometricForLogin: boolean;
  };
  userData: UserData | null;
  sessionId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  rememberMe: false,
  needsBiometricVerification: false,
  biometricPreferences: {
    useBiometricForPassword: false,
    useBiometricForLogin: false,
  },
  userData: null,
  sessionId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{
      username: string;
      rememberMe: boolean;
      sessionId: string;
    }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.rememberMe = action.payload.rememberMe;
      state.sessionId = action.payload.sessionId;
      state.needsBiometricVerification = false;
    },
    restoreSession: (state, action: PayloadAction<{
      username: string;
      rememberMe: boolean;
      sessionId: string;
    }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.rememberMe = action.payload.rememberMe;
      state.sessionId = action.payload.sessionId;
      state.needsBiometricVerification = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.rememberMe = false;
      state.needsBiometricVerification = false;
      state.biometricPreferences = {
        useBiometricForPassword: false,
        useBiometricForLogin: false,
      };
      state.userData = null;
      state.sessionId = null;
      // Los datos se limpian desde el authService
    },
    sessionLogout: (state) => {
      state.isAuthenticated = false;
      state.sessionId = null;
      if (!state.rememberMe) {
        state.username = null;
        state.rememberMe = false;
        state.needsBiometricVerification = false;
        state.biometricPreferences = {
          useBiometricForPassword: false,
          useBiometricForLogin: false,
        };
        state.userData = null;
      }
      // La limpieza de datos se maneja desde el authService
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
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
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
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        if (action.payload) {
          state.userData = action.payload;
        }
      })
      .addCase(loadRememberMe.fulfilled, (state, action) => {
        if (action.payload) {
          state.rememberMe = action.payload.rememberMe;
          state.username = action.payload.username;
        }
      })
      .addCase(saveRememberMe.fulfilled, (state, action) => {
        state.rememberMe = action.payload.rememberMe;
        state.username = action.payload.username;
      });
  },
});

export const { loginSuccess, restoreSession, logout, sessionLogout, clearSession, completeBiometricVerification, updateBiometricPreferences, setSessionId } = authSlice.actions;
export default authSlice.reducer;