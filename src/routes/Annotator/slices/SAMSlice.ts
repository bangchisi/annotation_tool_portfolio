// samSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SAMState {
  SAM: {
    model: string | null;
    modelLoading: boolean;
    modelLoaded: boolean;
    embeddingLoading: boolean;
    embeddingLoaded: boolean;
    embeddingId: number | null;
    everythingLoading: boolean;
    clickLoading: boolean;
  };
}

const initialState: SAMState = {
  SAM: {
    model: null,
    modelLoading: false,
    modelLoaded: false,
    embeddingLoading: false,
    embeddingLoaded: false,
    embeddingId: null,
    everythingLoading: false,
    clickLoading: false,
  },
};

const samSlice = createSlice({
  name: 'sam',
  initialState,
  reducers: {
    // 여기에 SAM에 대한 액션 핸들러를 정의합니다.
    setSAMModel: (state, action: PayloadAction<string>) => {
      state.SAM.model = action.payload;
    },
    setSAMModelLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.modelLoading = action.payload;
    },
    setSAMModelLoaded: (state, action: PayloadAction<boolean>) => {
      state.SAM.modelLoaded = action.payload;
    },
    setSAMEmbeddingLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.embeddingLoading = action.payload;
    },
    setSAMEmbeddingLoaded: (state, action: PayloadAction<boolean>) => {
      state.SAM.embeddingLoaded = action.payload;
    },
    setSAMEmbeddingId: (state, action: PayloadAction<number | null>) => {
      state.SAM.embeddingId = action.payload;
    },
    setSAMEverythingLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.everythingLoading = action.payload;
    },
    setSAMClickLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.clickLoading = action.payload;
    },
  },
});

export const {
  setSAMModel,
  setSAMModelLoading,
  setSAMModelLoaded,
  setSAMEmbeddingLoading,
  setSAMEmbeddingLoaded,
  setSAMEmbeddingId,
  setSAMEverythingLoading,
  setSAMClickLoading,
} = samSlice.actions;

export default samSlice.reducer;
