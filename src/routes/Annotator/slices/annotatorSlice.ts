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
      // console.log('annotatorSlice.ts, set tool');
      // state.selectedTool = action.payload.selectedTool;
      state.selectedTool = action.payload;
    },
    setCategories: (state, action) => {
      // console.log('annotatorSlice.ts, set categories');
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action) => {
      // console.log('annotatorSlice.ts, set currentCategory');
      // state.currentCategory = action.payload.currentCategory;
      state.currentCategory = action.payload;
    },
    setCurrentAnnotation: (state, action) => {
      // console.log('annotatorSlice.ts, set currentAnnotation');
      // state.currentAnnotation = action.payload.currentAnnotation;
      state.currentAnnotation = action.payload;
    },
    addAnnotation: (state, action) => {
      // console.log('annotatorSlice.ts, add annotation');
      // state.currentCategory?.annotations.push(action.payload.newAnnotation);
      state.currentCategory?.annotations.push(action.payload);
    },
    updateCurrentAnnotationPath: (state, action) => {
      if (state.currentAnnotation) {
        state.currentAnnotation.path = action.payload;
      }
    },
    updateCurrentCategory: (state, action) => {
      if (!state.currentCategory || state.currentAnnotation?.path) {
        return state;
      }

      state.currentCategory.annotations = state.currentCategory.annotations.map(
        (annotation) => {
          if (annotation.id === action.payload.id) {
            return action.payload;
          } else {
            return annotation;
          }
        },
      );
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
