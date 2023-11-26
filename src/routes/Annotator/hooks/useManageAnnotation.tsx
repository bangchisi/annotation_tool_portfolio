import paper from 'paper';
import { getRandomHexColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import {
  deleteAnnotation,
  selectAnnotator,
  setCurrentAnnotation,
  setCurrentCategory,
  updateAnnotation,
} from '../slices/annotatorSlice';
import useReloadAnnotator from './useReloadAnnotator';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import AnnotatorModel from '../models/Annotator.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useState } from 'react';

const useManageAnnotation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { image, categories, currentCategory, currentAnnotation } =
    useReloadAnnotator();
  const { datasetId } = useAppSelector(selectAnnotator);

  // empty annotation 생성
  async function createEmptyAnnotation() {
    // 항목 2. categories 업데이트
    if (!image || !datasetId || !categories || !currentCategory) return;

    // 랜덤 색상 생성
    const annotationColor = getRandomHexColor();

    setIsLoading(true);
    try {
      // 빈 annotation 껍데기 생성 요청
      const response = await AnnotatorModel.createAnnotation(
        image.imageId,
        datasetId,
        currentCategory.categoryId,
        annotationColor,
      );

      if (response.status !== 200)
        throw new Error('Failed to create annotation');

      // 서버에서 생성한 마지막 annotation id
      const nextAnnotationId = response.data.annotationId;

      // 새 annotation 생성, default 값들임.
      const newAnnotation = {
        annotationId: nextAnnotationId,
        isCrowd: false,
        isBbox: false,
        color: annotationColor,
        segmentation: [[]],
        area: 0,
        bbox: [0, 0, 0, 0],
      };

      // 새 annotation 추가
      dispatch(
        updateAnnotation({
          categoryId: currentCategory.categoryId,
          annotation: newAnnotation,
        }),
      );

      // 항목 1. paper 업데이트
      const compoundPathToAdd = new paper.CompoundPath({});
      compoundPathToAdd.fillColor = new paper.Color(annotationColor);
      compoundPathToAdd.strokeColor = new paper.Color(1, 1, 1, 1);
      compoundPathToAdd.opacity = 0.825;
      const dataToAdd = {
        categoryId: currentCategory.categoryId,
        annotationId: nextAnnotationId,
        annotationColor: annotationColor,
      };
      compoundPathToAdd.data = dataToAdd;

      // 항목 3. currentAnnotation 업데이트
      dispatch(setCurrentAnnotation(newAnnotation));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create annotation');
      alert('annotation 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  // 현재 annotation 삭제
  const deleteCurrentAnnotation = () => {
    if (!categories) return;
    if (!currentCategory || !currentAnnotation) return;

    dispatch(
      deleteAnnotation({
        categoryId: currentCategory.categoryId,
        annotationId: currentAnnotation.annotationId,
      }),
    );
  };

  const onClickDeleteButton = async (
    categoryId: number,
    annotationId: number,
  ) => {
    setIsLoading(true);
    try {
      const response = await AnnotatorModel.deleteAnnotation(annotationId);
      if (response.status !== 200)
        throw new Error('Failed to delete annotation');

      // delete compound in canvas
      deleteCompound(categoryId, annotationId);

      deleteAnnotationInCategory(annotationId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete annotation');
      alert('annotation 삭제 실패. 다시 시도 해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompound = (categoryId: number, annotationId: number) => {
    const childrenCompound = paper.project.activeLayer.children.filter(
      (child) => child instanceof paper.CompoundPath,
    );

    childrenCompound.forEach((child) => {
      if (
        child.data.categoryId === categoryId &&
        child.data.annotationId === annotationId
      ) {
        child.remove();
      }
    });
  };

  // 특정 annotation 삭제
  const deleteAnnotationInCategory = (annotationId: number) => {
    if (!categories || !currentCategory) return;
    dispatch(
      deleteAnnotation({
        categoryId: currentCategory.categoryId,
        annotationId,
      }),
    );
  };

  // annotation 선택
  const selectAnnotation = (categoryId: number, annotationId: number) => {
    if (!categories) return;

    const selectedCategory = categories[categoryId];

    if (!selectedCategory) return;

    dispatch(setCurrentCategory(selectedCategory));

    const selectedCurrentAnnotation =
      selectedCategory.annotations[annotationId];

    if (annotationId < 0) {
      dispatch(setCurrentAnnotation(undefined));
      return;
    }
    dispatch(setCurrentAnnotation(selectedCurrentAnnotation));
  };

  return {
    isLoading,
    setIsLoading,
    createEmptyAnnotation,
    deleteCurrentAnnotation,
    selectAnnotation,
    onClickDeleteButton,
  };
};

export default useManageAnnotation;
