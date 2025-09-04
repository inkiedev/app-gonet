import { BiometricPreferences, secureStorageService, UserData } from '@/services/secure-storage';
import { Subscription } from '@/types/subscription';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const loadBiometricPreferences = createAsyncThunk(
  'auth/loadBiometricPreferences',
  async () => {
    const preferences = await secureStorageService.getBiometricPreferences();
    return preferences;
  }
);

const saveBiometricPreferences = createAsyncThunk(
  'auth/saveBiometricPreferences',
  async (preferences: BiometricPreferences) => {
    await secureStorageService.saveBiometricPreferences(preferences);
    return preferences;
  }
);

const saveUserData = createAsyncThunk(
  'auth/saveUserData',
  async (userData: UserData) => {
    await secureStorageService.saveUserData(userData);
    return userData;
  }
);

const loadUserData = createAsyncThunk(
  'auth/loadUserData',
  async () => {
    const userData = await secureStorageService.getUserData();
    return userData;
  }
);

const updateStoredPassword = createAsyncThunk(
  'auth/updateStoredPassword',
  async ({ newPassword, uid, username, rememberMe }: { 
    newPassword: string; 
    uid: number; 
    username: string; 
    rememberMe: boolean; 
  }) => {
    if (rememberMe) {
      const updatedCredentials = { uid, username, password: newPassword };
      await secureStorageService.saveCredentials(updatedCredentials, rememberMe);
    }
    return newPassword;
  }
);

const loadSubscriptionsData = createAsyncThunk(
  'auth/loadSubscriptionsData',
  async () => {
    const subscriptions = await secureStorageService.getSubscriptions();
    const selectedIndex = await secureStorageService.getSelectedAccountIndex();
    return { subscriptions, selectedIndex };
  }
);

// Helper function is no longer needed since we store the full subscription

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
  currentAccount: Subscription | null;
  subscriptions: Subscription[];
  selectedAccountIndex: number;
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
  currentAccount: null,
  subscriptions: [],
  selectedAccountIndex: 0,
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
      state.currentAccount = null;
      state.subscriptions = [];
      state.selectedAccountIndex = 0;
      secureStorageService.clearBiometricPreferences();
      secureStorageService.clearUserData();
      secureStorageService.clearThemePreferences();
      secureStorageService.clearSubscriptions();
      secureStorageService.clearSelectedAccountIndex();
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
        state.currentAccount = null;
        state.subscriptions = [];
        state.selectedAccountIndex = 0;
        secureStorageService.clearBiometricPreferences();
        secureStorageService.clearUserData();
        secureStorageService.clearThemePreferences();
        secureStorageService.clearSubscriptions();
        secureStorageService.clearSelectedAccountIndex();
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
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload;
      state.selectedAccountIndex = 0; // Default to first account
      
      // Auto-update currentAccount from first subscription
      if (action.payload.length > 0) {
        state.currentAccount = action.payload[0];
      }
    },
    selectAccount: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.subscriptions.length) {
        state.selectedAccountIndex = index;
        state.currentAccount = state.subscriptions[index];
        
        // Persist the selection
        secureStorageService.saveSelectedAccountIndex(index);
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
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        // saveUserData is no longer used since we store full subscription
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        // loadUserData is no longer used since we store full subscription
      })
      .addCase(updateStoredPassword.fulfilled, (state, action) => {
        state.password = action.payload;
      })
      .addCase(loadSubscriptionsData.fulfilled, (state, action) => {
        if (action.payload.subscriptions.length > 0) {
          state.subscriptions = action.payload.subscriptions;
          const selectedIndex = Math.min(action.payload.selectedIndex, action.payload.subscriptions.length - 1);
          state.selectedAccountIndex = selectedIndex;
          state.currentAccount = action.payload.subscriptions[selectedIndex];
        }
      });
  },
});

export const { 
  loginSuccess, 
  restoreSession, 
  logout, 
  sessionLogout, 
  clearSession, 
  completeBiometricVerification, 
  updateBiometricPreferences, 
  updatePassword,
  setSubscriptions,
  selectAccount
} = authSlice.actions;

export {
  loadBiometricPreferences, loadSubscriptionsData, loadUserData, saveBiometricPreferences,
  saveUserData, updateStoredPassword
};

export default authSlice.reducer;