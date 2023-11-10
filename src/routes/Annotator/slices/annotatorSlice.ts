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
  embeddedImageId?: number;
  datasetId?: number;
  image?: ImageType;
  categories: CategoriesType;
  currentCategory?: CurrentCategoryType;
  currentAnnotation?: CurrentAnnotationType;
}

const initialState: initialStateType = {
  selectedTool: Tool.Select,
  isSAMModelLoaded: false,
  categories: {},
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
    updateCategories: (state, action: PayloadAction<CategoryType>) => {
      // state.categories.set(action.payload.categoryId, action.payload);
      state.categories[`${action.payload.categoryId}`] = action.payload;
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
  updateCategories,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
