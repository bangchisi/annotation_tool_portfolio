import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserType {
  userId?: string;
  username?: string;
}

const initialState = {
  user: {},
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
