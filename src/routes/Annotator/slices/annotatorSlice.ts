import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CategoriesType,
  CategoryType,
  AnnotationType,
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
  categories: CategoriesType;
  currentCategory?: CategoryType;
  currentAnnotation?: AnnotationType;
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
    setCategories: (state, action: PayloadAction<CategoriesType>) => {
      // console.log('annotatorSlice.ts, set categories');
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<CategoryType>) => {
      // console.log('annotatorSlice.ts, set currentCategory');
      state.currentCategory = action.payload;
    },
    setCurrentAnnotation: (state, action: PayloadAction<AnnotationType>) => {
      // console.log('annotatorSlice.ts, set currentAnnotation');
      state.currentAnnotation = action.payload;
    },
    addAnnotation: (state, action) => {
      // console.log('annotatorSlice.ts, add annotation');
      // state.currentCategory?.annotations.push(action.payload);
    },
    updateCurrentAnnotationPath: (state, action) => {
      if (state.currentAnnotation) {
        // FIX: currentAnnotation.path is removed
        // state.currentAnnotation.path = action.payload;
      }
    },
    updateCurrentCategory: (state, action) => {
      // FIX: currentAnnotation.path is removed
      // if (!state.currentCategory || state.currentAnnotation?.path) {
      //   return state;
      // }
      // FIX: currentCategory.annotations is removed
      // state.currentCategory.annotations = state.currentCategory.annotations.map(
      //   (annotation) => {
      //     if (annotation.id === action.payload.id) {
      //       return action.payload;
      //     } else {
      //       return annotation;
      //     }
      //   },
      // );
    },
  },
});

export const {
  setTool,
  setCategories,
  setCurrentCategory,
  setCurrentAnnotation,
  addAnnotation,
  updateCurrentCategory,
  updateCurrentAnnotationPath,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
