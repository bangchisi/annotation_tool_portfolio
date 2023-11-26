import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserType {
  userId: string;
  userName: string;
  isOnline: boolean;
}

export interface PreferenceType {
  [key: string]: unknown;
  brushRadius: number;
  eraserRadius: number;
}

const initialState = {
  user: {
    userId: '',
    userName: '',
    isOnline: false,
  },
  preference: {
    brushRadius: 20,
    eraserRadius: 20,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: () => initialState,
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
    setEraserRadius: (state, action: PayloadAction<number>) => {
      state.preference.eraserRadius = action.payload;
    },
  },
});

export const {
  clearAuth,
  setUser,
  setIsAuthenticated,
  setPreference,
  setBrushRadius,
  setEraserRadius,
} = authSlice.actions;

export default authSlice.reducer;

const selectAuth = ({ auth }: { auth: typeof initialState }) => auth;

export { selectAuth };
