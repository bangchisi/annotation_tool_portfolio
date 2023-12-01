import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Tool } from '../Annotator';
import {
  selectAnnotator,
  setCurrentAnnotation,
  setCurrentCategory,
  setTool,
} from '../slices/annotatorSlice';
import useKeyEvent from './useKeyEvent';
import useManageAnnotation from './useManageAnnotation';
import {
  selectAuth,
  setBrushRadius,
  setEraserRadius,
} from 'routes/Auth/slices/authSlice';

export const useKeyEvents = () => {
  const dispatch = useAppDispatch();
  const { selectedTool, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const { brushRadius, eraserRadius } = useAppSelector(selectAuth).preference;

  const { createEmptyAnnotation, onClickDeleteButton } = useManageAnnotation();

  useKeyEvent('Space', createEmptyAnnotation);

  useKeyEvent('BracketLeft', () => {
    if (selectedTool === Tool.Brush && brushRadius > 1) {
      dispatch(setBrushRadius(brushRadius - 1));
    } else if (selectedTool === Tool.Eraser && eraserRadius > 1) {
      dispatch(setEraserRadius(eraserRadius - 1));
    }
  });

  useKeyEvent('BracketRight', () => {
    if (selectedTool === Tool.Brush && brushRadius > 0) {
      dispatch(setBrushRadius(brushRadius + 1));
    } else if (selectedTool === Tool.Eraser && eraserRadius > 0) {
      dispatch(setEraserRadius(eraserRadius + 1));
    }
  });

  useKeyEvent('Backspace', () => {
    if (!currentCategory || !currentAnnotation) return;
    onClickDeleteButton(
      currentCategory.categoryId,
      currentAnnotation.annotationId,
    );
  });

  useKeyEvent('KeyS', () => {
    dispatch(setTool(Tool.Select));
    dispatch(setCurrentAnnotation(undefined));
    dispatch(setCurrentCategory(undefined));
  });

  useKeyEvent('KeyR', () => {
    if (!currentCategory || !currentAnnotation) return;
    dispatch(setTool(Tool.Box));
  });

  useKeyEvent('KeyB', () => {
    if (!currentCategory || !currentAnnotation) return;
    dispatch(setTool(Tool.Brush));
  });

  useKeyEvent('KeyE', () => {
    if (!currentCategory || !currentAnnotation) return;
    dispatch(setTool(Tool.Eraser));
  });

  useKeyEvent('KeyF', () => {
    if (!currentCategory || !currentAnnotation) return;
    dispatch(setTool(Tool.SAM));
  });
};
