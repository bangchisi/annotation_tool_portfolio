import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
} from './slices/annotatorSlice';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import useReloadAnnotator from './hooks/useReloadAnnotator';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

export default function Annotator() {
  const dispatch = useAppDispatch();
  const { isLoading, initData } = useReloadAnnotator();
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  );

  // init data
  useEffect(() => {
    initData(imageId);

    return () => {
      dispatch(setCategories({}));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!categories) return;
    if (!currentCategory || !currentAnnotation) return;
    const currentCategoryToUpdate = categories[currentCategory.categoryId];
    if (!currentCategoryToUpdate) return;
    const currentAnnotationToUpdate =
      currentCategoryToUpdate.annotations[currentAnnotation.annotationId];

    dispatch(setCurrentCategory(currentCategoryToUpdate));
    dispatch(setCurrentAnnotation(currentAnnotationToUpdate));
  }, [categories]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
      {isLoading && (
        <LoadingSpinner message="이미지 정보를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
      {SAMEverythingLoading && (
        <LoadingSpinner message="SAM Everything 생성중입니다..." />
      )}
    </Container>
  );
}
