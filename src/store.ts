import { configureStore } from '@reduxjs/toolkit';
import annotatorReducer from 'routes/Annotator/slices/annotatorSlice';
import samReducer from 'routes/Annotator/slices/SAMSlice';
import authReducer from 'routes/Auth/slices/authSlice';
// redux-persist session storage imports
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// SAM 상태를 지속하지 않도록 설정
// const SAMTransform = createTransform(
//   (inboundState, key) => {
//     if (
//       key === 'annotator' &&
//       typeof inboundState === 'object' &&
//       inboundState !== null
//     ) {
//       return {
//         ...inboundState,
//         SAM: undefined,
//       };
//     }
//     return inboundState;
//   },
//   (outboundState) => outboundState, // 'key'는 사용되지 않으므로 제거합니다.
// );

// config persist
const persistConfig = {
  key: 'root',
  storage,
  // transforms: [SAMTransform],
};

// config store
const persistedAnnotatorReducer = persistReducer(
  persistConfig,
  annotatorReducer,
);

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    annotator: persistedAnnotatorReducer,
    auth: persistedAuthReducer,
    sam: samReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
