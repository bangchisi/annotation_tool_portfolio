import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserType {
  userId: string;
  username: string;
  isOnline: boolean;
}

const initialState = {
  user: {
    userId: '',
    username: '',
    isOnline: false,
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
  },
});

export const { setUser, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
