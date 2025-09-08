import { BiometricPreferences, secureStorageService, UserData, ThemePreferences } from '@/services/secure-storage';
import { Subscription } from '@/types/subscription';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/services/api';

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

const saveThemePreferences = createAsyncThunk(
  'auth/saveThemePreferences',
  async (preferences: ThemePreferences) => {
    await secureStorageService.saveThemePreferences(preferences);
    return preferences;
  }
);

const loadThemePreferences = createAsyncThunk(
  'auth/loadThemePreferences',
  async () => {
    const preferences = await secureStorageService.getThemePreferences();
    return preferences;
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

const refreshSubscriptionsFromAPI = createAsyncThunk(
  'auth/refreshSubscriptionsFromAPI',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const { username } = state.auth;
    
    if (!username) {
      throw new Error('Username not available');
    }

    // Fetch fresh subscriptions from API
    const subscriptions = await apiService.getSuscription('enterprise', username);
    const selectedIndex = await secureStorageService.getSelectedAccountIndex();
    
    // Persist updated subscriptions
    await secureStorageService.saveSubscriptions(subscriptions);
    
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
  themePreferences: ThemePreferences;
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
  themePreferences: {
    isDark: false,
    followSystem: true,
    fontSize: 'medium',
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
      state.themePreferences = {
        isDark: false,
        followSystem: true,
        fontSize: 'medium',
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
        state.themePreferences = {
          isDark: false,
          followSystem: true,
          fontSize: 'medium',
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
    updateCurrentAccountPartner: (state, action: PayloadAction<Partial<Subscription['partner']>>) => {
      if (state.currentAccount && state.currentAccount.partner) {
        // Update current account partner data
        state.currentAccount.partner = {
          ...state.currentAccount.partner,
          ...action.payload
        };
        
        // Also update the same partner in subscriptions array
        const currentIndex = state.selectedAccountIndex;
        if (state.subscriptions[currentIndex]) {
          state.subscriptions[currentIndex].partner = {
            ...state.subscriptions[currentIndex].partner,
            ...action.payload
          };
          
          // Persist updated subscriptions
          secureStorageService.saveSubscriptions(state.subscriptions);
        }
      }
    },
    updateThemePreferences: (state, action: PayloadAction<Partial<ThemePreferences>>) => {
      if (action.payload.isDark !== undefined) {
        state.themePreferences.isDark = action.payload.isDark;
      }
      if (action.payload.followSystem !== undefined) {
        state.themePreferences.followSystem = action.payload.followSystem;
      }
      if (action.payload.fontSize !== undefined) {
        state.themePreferences.fontSize = action.payload.fontSize;
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
      })
      .addCase(refreshSubscriptionsFromAPI.fulfilled, (state, action) => {
        if (action.payload.subscriptions.length > 0) {
          state.subscriptions = action.payload.subscriptions;
          const selectedIndex = Math.min(action.payload.selectedIndex, action.payload.subscriptions.length - 1);
          state.selectedAccountIndex = selectedIndex;
          state.currentAccount = action.payload.subscriptions[selectedIndex];
        }
      })
      .addCase(loadThemePreferences.fulfilled, (state, action) => {
        if (action.payload) {
          state.themePreferences = action.payload;
        }
      })
      .addCase(saveThemePreferences.fulfilled, (state, action) => {
        state.themePreferences = action.payload;
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
  selectAccount,
  updateCurrentAccountPartner,
  updateThemePreferences
} = authSlice.actions;

export {
  loadBiometricPreferences, 
  loadSubscriptionsData, 
  refreshSubscriptionsFromAPI,
  loadUserData, 
  saveBiometricPreferences,
  saveUserData, 
  updateStoredPassword,
  loadThemePreferences,
  saveThemePreferences
};

export default authSlice.reducer;