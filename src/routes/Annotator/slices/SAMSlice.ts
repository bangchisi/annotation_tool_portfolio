// samSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SAMState {
  model: string;
  modelLoading: boolean;
  modelLoaded: boolean;
  embeddingLoading: boolean;
  embeddingLoaded: boolean;
  embeddingId: number | null;
  everythingLoading: boolean;
  clickLoading: boolean;
}

const initialState: SAMState = {
  model: 'vit_h',
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
    clearSAM: () => initialState,
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
  clearSAM,
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
