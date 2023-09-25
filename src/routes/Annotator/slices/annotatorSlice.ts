import { createSlice } from '@reduxjs/toolkit';
import { AnnotationType, CategoryType } from '../Annotator.types';

enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// const initialCategories: CategoryType[] = [
//   {
//     id: 1,
//     name: 'human',
//     annotations: [],
//   },
//   {
//     id: 2,
//     name: 'animal',
//     annotations: [],
//   },
//   {
//     id: 3,
//     name: 'building',
//     annotations: [],
//   },
//   {
//     id: 4,
//     name: 'machine',
//     annotations: [],
//   },
// ];

interface initialStateType {
  selectedTool: Tool;
  categories: CategoryType[];
  currentCategory: CategoryType | null;
  currentAnnotation: AnnotationType | null;
}

const initialState: initialStateType = {
  selectedTool: Tool.Box,
  categories: [],
  currentCategory: null,
  currentAnnotation: null,
};

const annotatorSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {
    setTool: (state, action) => {
      console.log('set tool');
      state.selectedTool = action.payload.selectedTool;
    },
    setCategories: (state, action) => {
      console.log('set categories');
      state.categories = action.payload.categories;
    },
    setCurrentCategory: (state, action) => {
      console.log('set currentCategory');
      state.currentCategory = action.payload.currentCategory;
    },
    setCurrentAnnotation: (state, action) => {
      console.log('set currentAnnotation');
      state.currentAnnotation = action.payload.currentAnnotation;
    },
  },
});

export const {
  setTool,
  setCategories,
  setCurrentCategory,
  setCurrentAnnotation,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;
