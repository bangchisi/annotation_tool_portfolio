import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserType {
  userId: string;
  userName: string;
  isOnline: boolean;
}

export interface PreferenceType {
  [key: string]: unknown;
  brushRadius: number;
}

const initialState = {
  user: {
    userId: '',
    userName: '',
    isOnline: false,
  },
  preference: {
    brushRadius: 10,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setPreference: (state, action: PayloadAction<PreferenceType>) => {
      state.preference = action.payload;
    },
    setBrushRadius: (state, action: PayloadAction<number>) => {
      state.preference.brushRadius = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated, setPreference, setBrushRadius } =
  authSlice.actions;

export default authSlice.reducer;
