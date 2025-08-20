import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  currentUser: {
    id: number;
    name: string;
    email: string;
    uid: number;
  } | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{
      id: number;
      name: string;
      email: string;
      uid: number;
    }>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action: PayloadAction<Partial<{
      name: string;
      email: string;
    }>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;