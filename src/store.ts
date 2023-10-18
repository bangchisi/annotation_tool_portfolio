import { configureStore } from '@reduxjs/toolkit';
import annotatorReducer from 'routes/Annotator/slices/annotatorSlice';

const store = configureStore({
  reducer: {
    annotator: annotatorReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
