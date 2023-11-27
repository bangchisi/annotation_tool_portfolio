import {
  AddButton,
  Container,
  DeleteAllButton,
  ButtonsContainer,
} from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Annotation } from './Annotation/Annotation';
import {
  selectAnnotator,
  deleteAnnotations,
  setTool,
  setCurrentCategoryByCategoryId,
  setCurrentAnnotationByAnnotationId,
} from 'routes/Annotator/slices/annotatorSlice';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import { Tool } from 'routes/Annotator/Annotator';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';

export default function AnnotationList() {
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, createEmptyAnnotation } = useManageAnnotation();
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
  function selectAnnotation(categoryId: number, annotationId: number) {
    if (!categories) return;

    const selectedCategory = categories[categoryId];

    if (!selectedCategory) return;

    dispatch(setCurrentCategoryByCategoryId(categoryId));

    dispatch(setCurrentAnnotationByAnnotationId(annotationId));
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
            onClick={selectAnnotation}
          />
        ))}
    </Container>
  );
}
