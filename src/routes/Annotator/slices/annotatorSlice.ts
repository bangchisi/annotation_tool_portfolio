import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CategoriesType,
  CategoryType,
  CurrentAnnotationType,
  CurrentCategoryType,
  ImageType,
} from '../Annotator.types';

enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

interface initialStateType {
  selectedTool: Tool;
  isSAMModelLoaded: boolean;
  isSAMModelLaoding: boolean;
  isEmbeddingLoading: boolean;
  isEverythingLoading: boolean;
  SAM: {
    [key: string]: unknown;
  };
  embeddedImageId?: number;
  datasetId?: number;
  image?: ImageType;
  categories?: CategoriesType;
  currentCategory?: CurrentCategoryType;
  currentAnnotation?: CurrentAnnotationType;
}

const initialState: initialStateType = {
  selectedTool: Tool.Select,
  isSAMModelLoaded: false,
  isSAMModelLaoding: false,
  isEmbeddingLoading: false,
  isEverythingLoading: false,
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

const annotatorSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {
    setTool: (state, action) => {
      // console.log('annotatorSlice.ts, set tool');
      state.selectedTool = action.payload;
    },
    setDatasetId: (state, action: PayloadAction<number>) => {
      state.datasetId = action.payload;
    },
    setImage: (state, action: PayloadAction<ImageType>) => {
      state.image = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoriesType>) => {
      // console.log('annotatorSlice.ts, set categories');
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<CurrentCategoryType>) => {
      // console.log('annotatorSlice.ts, set currentCategory');
      state.currentCategory = action.payload;
    },
    setCurrentAnnotation: (
      state,
      action: PayloadAction<CurrentAnnotationType>,
    ) => {
      // console.log('annotatorSlice.ts, set currentAnnotation');
      state.currentAnnotation = action.payload;
    },
    setIsSAMModelLoaded: (state, action: PayloadAction<boolean>) => {
      state.isSAMModelLoaded = action.payload;
    },
    setEmbeddedImageId: (state, action: PayloadAction<number | undefined>) => {
      state.embeddedImageId = action.payload;
    },
    setIsSAMModelLoading: (state, action: PayloadAction<boolean>) => {
      state.isSAMModelLaoding = action.payload;
    },
    setIsEmbeddingLoading: (state, action: PayloadAction<boolean>) => {
      state.isSAMModelLaoding = action.payload;
    },
    setIsEverythingLoading: (state, action: PayloadAction<boolean>) => {
      state.isSAMModelLaoding = action.payload;
    },
    updateCategories: (state, action: PayloadAction<CategoryType>) => {
      // state.categories.set(action.payload.categoryId, action.payload);
      if (!state.categories) return;
      state.categories[`${action.payload.categoryId}`] = action.payload;
    },
    setSAMModel: (state, action: PayloadAction<string>) => {
      state.SAM.model = action.payload;
    },
    setSAMModelLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.modelLoading = action.payload;
    },
    setSAMEverythingLoading: (state, action: PayloadAction<boolean>) => {
      state.SAM.everythingLoading = action.payload;
    },
  },
});

export const {
  setTool,
  setDatasetId,
  setImage,
  setCategories,
  setCurrentCategory,
  setCurrentAnnotation,
  setIsSAMModelLoaded,
  setEmbeddedImageId,
  setIsSAMModelLoading,
  setIsEmbeddingLoading,
  setIsEverythingLoading,
  updateCategories,
  // SAM 관련
  setSAMModel,
  setSAMModelLoading,
  setSAMEverythingLoading,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
