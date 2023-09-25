import { configureStore } from '@reduxjs/toolkit';
import annotatorReducer from 'routes/Annotator/slices/annotatorSlice';
// import annotationsReducer from 'routes/Annotator/slices/annotationsSlice';
// import categoriesReducer from 'routes/Annotator/slices/categoriesSlice';

const store = configureStore({
  reducer: {
    annotator: annotatorReducer,
    // annotations: annotationsReducer,
    // categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
