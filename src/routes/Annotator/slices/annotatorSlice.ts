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
    clearAnnotator: () => initialState,
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
    },
    setDatasetId: (state, action: PayloadAction<number>) => {
      state.datasetId = action.payload;
    },
    setImage: (state, action: PayloadAction<ImageType>) => {
      state.image = action.payload;
    },
    setCategories: (
      state,
      action: PayloadAction<CategoriesType | undefined>,
    ) => {
      state.categories = action.payload;
    },
    setCurrentCategoryByCategoryId: (state, action: PayloadAction<number>) => {
      if (!state.categories) return;

      const categoryId = action.payload;
      state.currentCategory = state.categories[categoryId];
    },
    setCurrentCategory: (
      state,
      action: PayloadAction<CurrentCategoryType | undefined>,
    ) => {
      state.currentCategory = action.payload;
    },
    setCurrentAnnotationByAnnotationId: (
      state,
      action: PayloadAction<number | undefined>,
    ) => {
      if (!state.currentCategory) return;

      const annotationId = action.payload;
      if (annotationId === undefined) state.currentAnnotation = undefined;
      else
        state.currentAnnotation =
          state.currentCategory.annotations[annotationId];
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
    setLastSelectedAnnotationByCategoryId: (
      state,
      action: PayloadAction<{
        categoryId: number;
        annotationId: number;
      }>,
    ) => {
      const { categoryId, annotationId } = action.payload;
      if (!state.categories) return;
      state.categories[categoryId].lastSelectedAnnotation = annotationId;
    },
    addAnnotation: (
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
  clearAnnotator,
  setTool,
  setDatasetId,
  setImage,
  setCategories,
  setCurrentCategoryByCategoryId,
  setCurrentCategory,
  setCurrentAnnotationByAnnotationId,
  setCurrentAnnotation,
  setLastSelectedAnnotationByCategoryId,
  updateCategories,
  addAnnotation,
  deleteAnnotation,
  deleteAnnotations,
} = annotatorSlice.actions;

export default annotatorSlice.reducer;

const selectAnnotator = ({ annotator }: { annotator: initialStateType }) => {
  return annotator;
};

export { selectAnnotator };
