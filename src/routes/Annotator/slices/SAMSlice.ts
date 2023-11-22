// samSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SAMState {
  model: string | null;
  modelLoading: boolean;
  modelLoaded: boolean;
  embeddingLoading: boolean;
  embeddingLoaded: boolean;
  embeddingId: number | null;
  everythingLoading: boolean;
  clickLoading: boolean;
}

const initialState: SAMState = {
  model: null,
  modelLoading: false,
  modelLoaded: false,
  embeddingLoading: false,
  embeddingLoaded: false,
  embeddingId: null,
  everythingLoading: false,
  clickLoading: false,
};

const samSlice = createSlice({
  name: 'sam',
  initialState,
  reducers: {
    // 여기에 SAM에 대한 액션 핸들러를 정의합니다.
    setSAMModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setSAMModelLoading: (state, action: PayloadAction<boolean>) => {
      state.modelLoading = action.payload;
    },
    setSAMModelLoaded: (state, action: PayloadAction<boolean>) => {
      state.modelLoaded = action.payload;
    },
    setSAMEmbeddingLoading: (state, action: PayloadAction<boolean>) => {
      state.embeddingLoading = action.payload;
    },
    setSAMEmbeddingLoaded: (state, action: PayloadAction<boolean>) => {
      state.embeddingLoaded = action.payload;
    },
    setSAMEmbeddingId: (state, action: PayloadAction<number | null>) => {
      state.embeddingId = action.payload;
    },
    setSAMEverythingLoading: (state, action: PayloadAction<boolean>) => {
      state.everythingLoading = action.payload;
    },
    setSAMClickLoading: (state, action: PayloadAction<boolean>) => {
      state.clickLoading = action.payload;
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

const selectSAM = ({ sam }: { sam: SAMState }) => sam;

export { selectSAM };
