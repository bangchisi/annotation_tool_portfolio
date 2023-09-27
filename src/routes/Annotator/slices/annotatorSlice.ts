import { createSlice } from '@reduxjs/toolkit';
import { AnnotationType, CategoryType } from '../Annotator.types';

enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

interface initialStateType {
  selectedTool: Tool;
  categories: CategoryType[];
  currentCategory?: CategoryType;
  currentAnnotation?: AnnotationType;
}

const initialState: initialStateType = {
  selectedTool: Tool.Box,
  categories: [],
};

const annotatorSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {
    setTool: (state, action) => {
      console.log('annotatorSlice.ts, set tool');
      state.selectedTool = action.payload.selectedTool;
    },
    setCategories: (state, action) => {
      console.log('annotatorSlice.ts, set categories');
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action) => {
      console.log('annotatorSlice.ts, set currentCategory');
      state.currentCategory = action.payload.currentCategory;
    },
    setCurrentAnnotation: (state, action) => {
      console.log('annotatorSlice.ts, set currentAnnotation');
      state.currentAnnotation = action.payload.currentAnnotation;
    },
    addBoxAnnotation: (state, action) => {
      console.log('annotatorSlice.ts, add annotation');
      state.currentCategory?.annotations.push(action.payload.newAnnotation);
    },
    addAnnotation: (state, action) => {
      console.log('add annotation');
      state.currentCategory?.annotations.push(action.payload.newAnnotation);
    },
    updateAnnotation: (state, action) => {
      if (state.currentAnnotation) {
        state.currentAnnotation.path = action.payload.path;
      }
    },
  },
});

export const {
  setTool,
  setCategories,
  setCurrentCategory,
  setCurrentAnnotation,
  addBoxAnnotation,
  updateAnnotation,
  addAnnotation,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
