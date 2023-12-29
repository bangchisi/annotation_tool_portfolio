import { useAppDispatch, useAppSelector } from 'App.hooks';
import { getRandomHexColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import paper from 'paper';
import { useState } from 'react';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import {
  addAnnotation,
  deleteAnnotation,
  selectAnnotator,
  setCurrentAnnotationByAnnotationId,
  setCurrentCategoryByCategoryId,
  setLastSelectedAnnotationByCategoryId,
} from '../slices/annotatorSlice';
import useReloadAnnotator from './useReloadAnnotator';
import { useTypedSWRMutation } from 'hooks';
import useSWRMutation from 'swr/mutation';

export const selectPathSegments = (
  categoryId: number,
  annotationId: number,
) => {
  const { children } = paper.project.activeLayer;

  children.forEach((child) => {
    child.selected = false;
  });
  paper.project.selectedItems.forEach((item) => (item.selected = false));
  const selectedMask = children.find(
    (child) =>
      child.data.categoryId === categoryId &&
      child.data.annotationId === annotationId,
  );

  if (!selectedMask) return;
  selectedMask.selected = true;
};

export const deselectPathSegments = () => {
  paper.project.selectedItems.forEach((item) => (item.selected = false));
};

const useManageAnnotation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { image, categories, currentCategory, currentAnnotation } =
    useReloadAnnotator();
  const { datasetId } = useAppSelector(selectAnnotator);

  const { trigger: createAnnotation } = useTypedSWRMutation<{
    annotationId: number;
    color: string;
  }>(
    {
      method: 'post',
      endpoint: '/annotation',
    },
    {
      image_id: image?.imageId,
      dataset_id: datasetId,
      category_id: currentCategory?.categoryId,
      color: getRandomHexColor(),
    },
  );

  const deleteAnnotationByIdFetcher = async (
    url: string,
    { arg }: { arg: { annotationId: number } },
  ) => {
    try {
      await typedAxios('delete', `/annotation/${arg.annotationId}`);
    } catch (error) {
      console.log('Failed to delete annotation');
    }
  };

  const { trigger: deleteAnnotationById } = useSWRMutation(
    '/annotation/delete',
    deleteAnnotationByIdFetcher,
  );

  // empty annotation 생성
  async function createEmptyAnnotation() {
    // 항목 2. categories 업데이트
    if (categories && Object.keys(categories).length < 1) {
      alert(
        '현재 Dataset에 추가된 카테고리가 없습니다. Dataset 페이지에서 카테고리를 추가해주세요.',
      );
    }
    if (!image || !datasetId || !categories || !currentCategory) {
      return;
    }

    const { initialLayerState } = AnnotationTool;
    if (initialLayerState === '') {
      AnnotationTool.initializeHistory();
    }

    setIsLoading(true);

    try {
      const { annotationId, color } = await createAnnotation();
      // 서버에서 생성한 마지막 annotation id
      const newAnnotationId = annotationId;

      // 새 annotation 생성, default 값들임.
      const newAnnotation = {
        annotationId: newAnnotationId,
        isCrowd: false,
        isBbox: false,
        color: color,
        segmentation: [[]],
        area: 0,
        bbox: [0, 0, 0, 0],
      };

      // 새 annotation 추가
      dispatch(
        addAnnotation({
          categoryId: currentCategory.categoryId,
          annotation: newAnnotation,
        }),
      );

      // 항목 1. paper 업데이트
      const compoundPathToAdd = new paper.CompoundPath({});
      compoundPathToAdd.fillColor = new paper.Color(color);
      compoundPathToAdd.strokeColor = new paper.Color(1, 1, 1, 1);
      compoundPathToAdd.opacity = 0.5;
      const dataToAdd = {
        categoryId: currentCategory.categoryId,
        annotationId: newAnnotationId,
        annotationColor: color,
      };
      compoundPathToAdd.data = dataToAdd;

      // 항목 3. currentAnnotation 업데이트
      selectAnnotation(currentCategory.categoryId, newAnnotationId);
      paper.project.selectedItems.forEach((item) => (item.selected = false));
      const newMask = paper.project.activeLayer.children.find(
        (child) =>
          child.data.annotationId === newAnnotationId &&
          child.data.categoryId === currentCategory.categoryId,
      );
      if (!newMask) return;
      newMask.selected = true;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create annotation');
      alert('annotation 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  // categoryId, annotationId: target annotation to delete
  const onClickDeleteButton = async (
    categoryId: number,
    annotationId: number,
  ) => {
    setIsLoading(true);

    const annotationsList = Object.values(currentCategory?.annotations ?? {});
    const annotationIds =
      annotationsList.map((annotation) => Number(annotation.annotationId)) ??
      [];

    try {
      await deleteAnnotationById({ annotationId });

      // delete compound in canvas
      deleteCompound(categoryId, annotationId);

      // delete target annotation in category
      deleteAnnotationInCategory(annotationId);

      // select next annotation if needed
      if (currentAnnotation?.annotationId !== annotationId) {
        return;
      }

      // case 1: annotation 많이 있을 때
      const nextAnnotationIds = annotationIds.filter(
        (nextAnnotationId) => nextAnnotationId < Number(annotationId),
      );

      // case 2: annotation list가 1개가 될 때 (총 2개의 annotation이 있을 때, 1개 삭제)
      if (nextAnnotationIds.length === 1) {
        selectAnnotation(categoryId, nextAnnotationIds[0]);
        return;
      }

      // case 3: annotation 0개가 될 때 (총 1개의 annotation이 있을 때, 1개 삭제)
      if (nextAnnotationIds.length === 0) {
        selectAnnotation(categoryId, -1);
        return;
      }

      // case 1: annotation 많이 있을 때 continue
      const nextAnnotationId = Math.max(...nextAnnotationIds);
      selectAnnotation(categoryId, nextAnnotationId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete annotation');
      alert('annotation 삭제 실패. 다시 시도 해주세요.');
    } finally {
      AnnotationTool.removeCommandsWithoutAnnotationIdFromHistory(
        annotationIds,
        annotationId,
      );
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

    // Select path segments
    selectPathSegments(categoryId, annotationId);

    if (currentAnnotation && currentAnnotation.annotationId === annotationId) {
      return;
    }

    dispatch(setCurrentCategoryByCategoryId(categoryId));
    dispatch(setCurrentAnnotationByAnnotationId(annotationId));
    dispatch(
      setLastSelectedAnnotationByCategoryId({ categoryId, annotationId }),
    );
  };

  return {
    isLoading,
    setIsLoading,
    createEmptyAnnotation,
    selectAnnotation,
    onClickDeleteButton,
  };
};

export default useManageAnnotation;
