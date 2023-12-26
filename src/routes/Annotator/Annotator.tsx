import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from './Annotator.style';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import Workbench from './components/Workbench/Workbench';
import { useKeyEvents } from './hooks/useKeyEvents';
import useReloadAnnotator from './hooks/useReloadAnnotator';
import {
  selectAnnotator,
  setCategories,
  setCurrentAnnotation,
  setCurrentAnnotationByAnnotationId,
  setCurrentCategory,
  setCurrentCategoryByCategoryId,
} from './slices/annotatorSlice';
import useWarningOnUnsavedChange from './hooks/useWarningOnUnsavedChange';

export default function Annotator() {
  const dispatch = useAppDispatch();
  const { isLoading, initData } = useReloadAnnotator();
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  );
  const { handleSave } = useWarningOnUnsavedChange();

  // @이슈: redux의 categories가 뒤로 가기 했을 때 초기화되지 않는 문때
  // init data
  useEffect(() => {
    setCategories(undefined);
    initData(imageId);

    return () => {
      dispatch(setCategories(undefined));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId, dispatch]);

  useEffect(() => {
    if (!currentCategory) return;
    dispatch(setCurrentCategoryByCategoryId(currentCategory.categoryId));
    if (!currentAnnotation) return;
    dispatch(
      setCurrentAnnotationByAnnotationId(currentAnnotation.annotationId),
    );

    return () => {
      dispatch(setCurrentCategory(undefined));
      dispatch(setCurrentAnnotation(undefined));
    };
  }, [categories, currentCategory, currentAnnotation, dispatch]);

  useKeyEvents();

  // shouldBlock: 저장하지 않았을 경우, true
  //              저장했을 경우, false

  return (
    <Container>
      <LeftSidebar onSave={handleSave} />
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
