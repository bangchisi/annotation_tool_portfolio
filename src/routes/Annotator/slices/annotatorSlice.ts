import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
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
  datasetId?: number;
  image?: ImageType;
  categories: CategoryType[];
  currentCategory?: CurrentCategoryType;
  currentAnnotation?: CurrentAnnotationType;
}

const initialState: initialStateType = {
  selectedTool: Tool.Select,
  categories: [],
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
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
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
  },
});

export const {
  setTool,
  setDatasetId,
  setImage,
  setCategories,
  setCurrentCategory,
  setCurrentAnnotation,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
