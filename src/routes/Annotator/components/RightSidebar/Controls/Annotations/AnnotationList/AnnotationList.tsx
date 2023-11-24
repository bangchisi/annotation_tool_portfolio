import paper from 'paper';
import { AddButton, Container, DeleteAllButton } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Annotation } from './Annotation/Annotation';
import {
  setCurrentAnnotation,
  setCurrentCategory,
  selectAnnotator,
  deleteAnnotation,
  deleteAnnotations,
  updateAnnotation,
  setTool,
} from 'routes/Annotator/slices/annotatorSlice';
import { getRandomHexColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import { Tool } from 'routes/Annotator/Annotator';

export default function AnnotationList() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { categories, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const imageId = Number(useParams().imageId);
  const datasetId = useAppSelector((state) => state.annotator.datasetId);
  const { clearCanvas } = useReloadAnnotator();
  const annotations = currentCategory?.annotations;

  // annotation 목록을 ID 내림차순 정렬
  const sortedAnnotations = useMemo(() => {
    if (!annotations) return [];

    return Object.entries(annotations).sort(
      (prev, next) => Number(next[0]) - Number(prev[0]),
    );
  }, [annotations]);

  // empty annotation 생성
  async function createEmptyAnnotation() {
    // 항목 2. categories 업데이트
    if (!imageId || !datasetId || !categories || !currentCategory) return;

    // 랜덤 색상 생성
    const annotationColor = getRandomHexColor();

    setIsLoading(true);
    try {
      // 빈 annotation 껍데기 생성 요청
      const response = await AnnotatorModel.createAnnotation(
        imageId,
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

  async function deleteAllAnnotations(imageId: number, categoryId: number) {
    try {
      const response = await AnnotatorModel.deleteAllAnnotations(
        imageId,
        categoryId,
      );
      if (response.status !== 200)
        throw new Error('Failed to delete all annotations');
      deleteAllAnnotationInCategories(categoryId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete all annotations');
    }
  }

  // annotation 선택
  function selectAnnotation(categoryId: number, annotationId: number) {
    if (!categories) return;

    const selectedCategory = categories[categoryId];

    if (!selectedCategory) return;

    dispatch(setCurrentCategory(selectedCategory));

    const selectedCurrentAnnotation =
      selectedCategory.annotations[annotationId];
    dispatch(setCurrentAnnotation(selectedCurrentAnnotation));
  }

  // 특정 annotation 삭제
  function deleteAnnotationInCategory(annotationId: number) {
    if (!categories || !currentCategory) return;
    dispatch(
      deleteAnnotation({
        categoryId: currentCategory.categoryId,
        annotationId,
      }),
    );
  }

  // category의 모든 annotation 삭제
  function deleteAllAnnotationInCategories(categoryId: number) {
    if (!categories) return;
    clearCanvas();
    dispatch(deleteAnnotations({ categoryId }));
  }

  useEffect(() => {
    if (currentAnnotation) return;
    if (sortedAnnotations.length <= 0) {
      dispatch(setTool(Tool.Select));
      return;
    }

    const annotationOnTop = sortedAnnotations[0][1];
    if (!annotationOnTop) return;

    dispatch(setCurrentAnnotation(annotationOnTop));
  }, [sortedAnnotations]);

  return (
    <Container>
      {isLoading && <LoadingSpinner message="annotation 목록 갱신 중입니다." />}
      <AddButton
        functionName="Add Annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createEmptyAnnotation}
        placement="left"
        isFunction={true}
      />
      <DeleteAllButton
        functionName="Delete All"
        iconComponent={<DeleteSweepOutlinedIcon />}
        handleClick={() => {
          // ...
          if (!currentCategory) return;
          confirm('모두 삭제 하시겠습니까?')
            ? deleteAllAnnotations(imageId, currentCategory.categoryId)
            : () => false;
        }}
        placement="left"
        isFunction={true}
      />
      {currentCategory &&
        sortedAnnotations &&
        sortedAnnotations.map(([annotationId, annotation]) => (
          <Annotation
            key={annotation.annotationId}
            categoryId={currentCategory.categoryId}
            categoryColor={currentCategory.color}
            annotationId={Number(annotationId)}
            annotationColor={annotation.color}
            onClick={selectAnnotation}
            setIsLoading={setIsLoading}
            deleteAnnotationInCategory={deleteAnnotationInCategory}
          />
        ))}
    </Container>
  );
}
