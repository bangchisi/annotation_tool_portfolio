import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
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
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { useTypedSWRMutation } from 'hooks';

// 어노테이션 목록 컴포넌트
export default function AnnotationList() {
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, createEmptyAnnotation, selectAnnotation } =
    useManageAnnotation(); // 어노테이션 생성, 선택 함수
  const dispatch = useAppDispatch();
  const { categories, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator); // 카테고리 목록, 현재 선택된 카테고리, 현재 선택된 어노테이션
  const imageId = Number(useParams().imageId); // 현재 이미지 id
  const { clearCanvas } = useReloadAnnotator(); // 캔버스 초기화 함수
  const annotations = currentCategory?.annotations; // 현재 카테고리의 어노테이션 목록. 추후 정렬을 위한 변수.

  // 어노테이션 모두 삭제 mutation
  const { trigger: clearAnnotations } = useTypedSWRMutation({
    method: 'delete',
    endpoint: `/annotation/clear/${imageId}/${currentCategory?.categoryId}`,
  });

  // annotation 목록을 ID 내림차순 정렬
  const sortedAnnotations = useMemo(() => {
    if (!annotations) return [];

    // compare function(prev, next)을 사용하여 annotationId를 기준으로 내림차순 정렬
    return Object.values(annotations).sort(
      (prev, next) => Number(next.annotationId) - Number(prev.annotationId),
    );
  }, [annotations]);

  // 현재 카테고리의 모든 어노테이션 삭제 버튼 클릭 핸들러
  async function deleteAllAnnotations(imageId: number, categoryId: number) {
    try {
      // 모든 어노테이션 삭제 요청
      await clearAnnotations();
      // 카테고리 id를 베이스로 어노테이션 목록을 비움
      deleteAllAnnotationInCategories(categoryId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete all annotations');
    }
  }

  // 현재 카테고리의 모든 어노테이션 삭제 함수
  function deleteAllAnnotationInCategories(categoryId: number) {
    if (!categories) return;
    // 캔버스 초기화
    clearCanvas();
    // 툴의 작업 히스토리 초기화. redo, undo 기록 삭제
    AnnotationTool.history.clearHistory();
    // 현재 카테고리의 어노테이션 목록을 비움
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
      {/* 어노테이션 목록을 가져오는 중이면 로딩 인디케이터 렌더링 */}
      {isLoading && <LoadingSpinner message="annotation 목록 갱신 중입니다." />}
      <ButtonsContainer className="annotation-buttons-step">
        {/* 어노테이션 생성 버튼 */}
        <AddButton
          functionName="Add Annotation (Spacebar)"
          iconComponent={<AddCircleOutlineOutlinedIcon />}
          handleClick={createEmptyAnnotation}
          placement="left"
          isFunction={true}
        />
        {/* 현재 카테고리의 모든 어노테이션 삭제 버튼 */}
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
        {/* 현재 카테고리의 어노테이션 목록을 렌더링 */}
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
