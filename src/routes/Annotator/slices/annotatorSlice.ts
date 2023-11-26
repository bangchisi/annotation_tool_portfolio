import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  AnnotationType,
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
  datasetId?: number;
  image?: ImageType;
  categories?: CategoriesType;
  currentCategory?: CurrentCategoryType;
  currentAnnotation?: CurrentAnnotationType;
}

const initialState: initialStateType = {
  selectedTool: Tool.Select,
};

const annotatorSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
    },
    setDatasetId: (state, action: PayloadAction<number>) => {
      state.datasetId = action.payload;
    },
    setImage: (state, action: PayloadAction<ImageType>) => {
      state.image = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoriesType>) => {
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<CurrentCategoryType>) => {
      state.currentCategory = action.payload;
    },
    setCurrentAnnotation: (
      state,
      action: PayloadAction<CurrentAnnotationType | undefined>,
    ) => {
      state.currentAnnotation = action.payload;
    },
    updateCategories: (state, action: PayloadAction<CategoryType>) => {
      if (!state.categories) return;
      state.categories[`${action.payload.categoryId}`] = action.payload;
    },
    updateAnnotation: (
      state,
      action: PayloadAction<{
        categoryId: number;
        annotation: AnnotationType;
      }>,
    ) => {
      if (!state.categories) return;

      const { categoryId, annotation } = action.payload;
      state.categories[categoryId].annotations[annotation.annotationId] =
        annotation;
    },
    deleteAnnotation: (
      state,
      action: PayloadAction<{
        categoryId: number;
        annotationId: number;
      }>,
    ) => {
      if (!state.categories) return;

      const { categoryId, annotationId } = action.payload;
      delete state.categories[categoryId].annotations[annotationId];
    },
    deleteAnnotations: (
      state,
      action: PayloadAction<{
        categoryId: number;
      }>,
    ) => {
      if (!state.categories) return;

      const { categoryId } = action.payload;
      state.categories[categoryId].annotations = {};
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
  updateCategories,
  updateAnnotation,
  deleteAnnotation,
  deleteAnnotations,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;

const selectAnnotator = ({ annotator }: { annotator: initialStateType }) => {
  return annotator;
};

export { selectAnnotator };
