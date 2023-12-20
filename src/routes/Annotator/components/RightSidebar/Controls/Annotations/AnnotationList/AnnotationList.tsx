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

    return Object.values(annotations).sort(
      (prev, next) => Number(next.annotationId) - Number(prev.annotationId),
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

  // category의 모든 annotation 삭제
  function deleteAllAnnotationInCategories(categoryId: number) {
    if (!categories) return;
    clearCanvas();
    dispatch(deleteAnnotations({ categoryId }));
  }

  // annotation이 없다면 Select Tool로 변경
  // currentAnnotation을 undefined로 변경
  useEffect(() => {
    if (!currentAnnotation || sortedAnnotations.length === 0) {
      dispatch(setTool(Tool.Select));
      dispatch(setCurrentAnnotationByAnnotationId(undefined));
    }
  }, [sortedAnnotations, currentAnnotation, dispatch]);

  // 마지막으로 선택된 annotation의 id를 가져와서
  // currentAnnotation을 업데이트
  const lastSelectedAnnotationId = useMemo(
    () => currentCategory?.lastSelectedAnnotation,
    [currentCategory?.lastSelectedAnnotation],
  );
  useEffect(() => {
    // 만약 lastSelectedAnnotation이 없다면
    // annotation이 없다면 아무것도 선택하지 않음 (currentAnnotation = undefined)
    let annotationIdToSelect = lastSelectedAnnotationId;
    if (!lastSelectedAnnotationId) {
      // sortedAnnotations의 첫번째 annotation을 선택
      annotationIdToSelect = sortedAnnotations?.[0]?.annotationId || undefined;
    }
    dispatch(setCurrentAnnotationByAnnotationId(annotationIdToSelect));
  }, [dispatch, sortedAnnotations, lastSelectedAnnotationId]);

  return (
    <Container>
      {isLoading && <LoadingSpinner message="annotation 목록 갱신 중입니다." />}
      <ButtonsContainer className="annotation-buttons-step">
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
      <div className="annotation-list-step">
        {currentCategory &&
          sortedAnnotations &&
          sortedAnnotations.map(({ annotationId, color }) => (
            <Annotation
              key={annotationId}
              categoryId={currentCategory.categoryId}
              annotationId={Number(annotationId)}
              annotationcolor={color}
              onClick={selectAnnotation}
            />
          ))}
      </div>
    </Container>
  );
}
