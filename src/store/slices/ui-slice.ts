import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { secureStorageService, ThemePreferences, FontSize } from '@/services/secure-storage';

export const loadThemePreferences = createAsyncThunk(
  'ui/loadThemePreferences',
  async () => {
    const preferences = await secureStorageService.getThemePreferences();
    return preferences;
  }
);

export const saveThemePreferences = createAsyncThunk(
  'ui/saveThemePreferences',
  async (preferences: ThemePreferences) => {
    await secureStorageService.saveThemePreferences(preferences);
    return preferences;
  }
);

interface UIState {
  themePreferences: {
    isDark: boolean;
    followSystem: boolean;
    fontSize: FontSize;
  };
}

const initialState: UIState = {
  themePreferences: {
    isDark: false,
    followSystem: true,
    fontSize: 'medium',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
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
    resetThemePreferences: (state) => {
      state.themePreferences = initialState.themePreferences;
      secureStorageService.clearThemePreferences();
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { updateThemePreferences, resetThemePreferences } = uiSlice.actions;
export default uiSlice.reducer;