import paper from 'paper';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import {
  deleteAnnotations,
  selectAnnotator,
  setCurrentAnnotationByAnnotationId,
  setCurrentCategoryByCategoryId,
  setTool,
} from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import { Annotation } from './Annotation/Annotation';
import {
  AddButton,
  ButtonsContainer,
  Container,
  DeleteAllButton,
} from './AnnotationList.style';

export default function AnnotationList() {
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, createEmptyAnnotation, selectAnnotation } =
    useManageAnnotation();
  const dispatch = useAppDispatch();
  const { categories, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const imageId = Number(useParams().imageId);
  const { clearCanvas } = useReloadAnnotator();
  const annotations = currentCategory?.annotations;

  // annotation 목록을 ID 내림차순 정렬
  const sortedAnnotations = useMemo(() => {
    if (!annotations) return [];

    return Object.entries(annotations).sort(
      (prev, next) => Number(next[0]) - Number(prev[0]),
    );
  }, [annotations]);

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
  function selectMask(categoryId: number, annotationId: number) {
    if (!categories) return;
    selectAnnotation(categoryId, annotationId);

    const { children } = paper.project.activeLayer;

    // loop through all children of the active layer and set selected to false
    children.forEach((child) => {
      child.selected = false;
    });

    const selectedMask = children.find(
      (child) =>
        child.data.categoryId === categoryId &&
        child.data.annotationId === annotationId,
    );

    if (!selectedMask) return;
    selectedMask.selected = true;
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

    const annotationIdOnTop = sortedAnnotations[0][1].annotationId;
    if (!annotationIdOnTop) return;

    dispatch(setCurrentAnnotationByAnnotationId(annotationIdOnTop));
  }, [sortedAnnotations]);

  return (
    <Container>
      {isLoading && <LoadingSpinner message="annotation 목록 갱신 중입니다." />}
      <ButtonsContainer>
        <AddButton
          functionName="Add Annotation (Spacebar)"
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
          placement="right"
          isFunction={true}
        />
      </ButtonsContainer>
      {currentCategory &&
        sortedAnnotations &&
        sortedAnnotations.map(([annotationId, annotation]) => (
          <Annotation
            key={annotation.annotationId}
            categoryId={currentCategory.categoryId}
            annotationId={Number(annotationId)}
            annotationcolor={annotation.color}
            onClick={selectMask}
          />
        ))}
    </Container>
  );
}
