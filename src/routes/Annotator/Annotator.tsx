import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from './Annotator.style';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import Workbench from './components/Workbench/Workbench';
import { useKeyEvents } from './hooks/useKeyEvents';
import {
  selectAnnotator,
  setCategories,
  setCurrentAnnotation,
  setCurrentAnnotationByAnnotationId,
  setCurrentCategory,
  setCurrentCategoryByCategoryId,
  setDatasetId,
  setImage,
} from './slices/annotatorSlice';
import useWarningOnUnsavedChange from './hooks/useWarningOnUnsavedChange';
import { useTypedSWR } from 'hooks';
import { CategoriesType, ImageType } from './Annotator.types';

// Annotator 초기 데이터 타입
export type InitDataType = {
  datasetId: number;
  categories: CategoriesType;
  image: ImageType;
};

// Annotator 컴포넌트
export default function Annotator() {
  const dispatch = useAppDispatch();
  const imageId = Number(useParams().imageId); // 현재 이미지 id, url에서 가져옴
  const categories = useAppSelector((state) => state.annotator.categories); // redux, 카테고리 목록 객체
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator); // redux, 현재 카테고리, 현재 어노테이션
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  ); // redux, SAM Everything 생성중인지 여부
  const { handleSave } = useWarningOnUnsavedChange(); // 저장하지 않았을 때 경고창 띄우기 위한 핸들러

  // 카테고리 객체 로드
  const { data, isLoading, error, mutate } = useTypedSWR<InitDataType>({
    method: 'get',
    endpoint: `/annotator/data/${imageId}`,
  });

  // 에러 처리
  if (error) alert('이미지 정보를 불러오는데 실패했습니다. 새로고침 해주세요.');

  // 로딩 처리
  if (isLoading)
    <LoadingSpinner message="이미지 정보를 불러오는 중입니다. 잠시만 기다려주세요." />;

  // 카테고리 목록 객체 로드 후, redux에 저장
  useEffect(() => {
    // 첫번째 카테고리 선택
    const selectFirstCategory = (categories: CategoriesType) => {
      const keys = Object.keys(categories); // 카테고리 객체의 키 배열

      // 카테고리가 없을 경우, 아무것도 하지 않음
      if (keys.length <= 0) return;

      const firstCategoryId = Number(keys[0]); // 첫번째 카테고리 id를 숫자로 변환

      // 첫번째 카테고리 id로 현재 카테고리 설정
      dispatch(setCurrentCategoryByCategoryId(firstCategoryId));
    };

    // 카테고리 목록 객체가 없을 경우, 아무것도 하지 않음
    if (!data) return;

    const { datasetId, categories, image } = data; // 카테고리 목록 객체에서 데이터 추출

    // redux에 저장
    dispatch(setCategories(categories));
    dispatch(setImage(image));
    dispatch(setDatasetId(datasetId));
    selectFirstCategory(categories);

    // 언마운트 시, redux에서 카테고리 목록 객체 삭제
    return () => {
      dispatch(setCategories(undefined));
    };
  }, [data, dispatch]);

  // 현재 카테고리, 어노테이션에 변화가 있을시 redux의 현재 카테고리, 어노테이션을 갱신
  useEffect(() => {
    // 현재 카테고리가 없으면 아무것도 하지 않음
    if (!currentCategory) return;
    // 카테고리 id로 현재 카테고리 설정
    dispatch(setCurrentCategoryByCategoryId(currentCategory.categoryId));
    // 현재 어노테이션이 없으면 아무것도 하지 않음
    if (!currentAnnotation) return;
    // 어노테이션 id로 현재 어노테이션 설정
    dispatch(
      setCurrentAnnotationByAnnotationId(currentAnnotation.annotationId),
    );

    // 페이지를 떠날때 현재 카테고리, 어노테이션을 undefined로 초기화
    return () => {
      dispatch(setCurrentCategory(undefined));
      dispatch(setCurrentAnnotation(undefined));
    };
  }, [categories, currentCategory, currentAnnotation, dispatch]);

  // 단축키 바인딩
  useKeyEvents();

  // shouldBlock: 저장하지 않았을 경우, true
  //              저장했을 경우, false

  return (
    <Container>
      {/* 왼쪽 툴바 */}
      <LeftSidebar onSave={handleSave} />
      {/* 캔버스 */}
      <Workbench />
      {/* 우측 패널 */}
      <RightSidebar reload={mutate} />
      {/* SAM Everything 생성 중일때 로딩 인디케이터 렌더링 */}
      {SAMEverythingLoading && (
        <LoadingSpinner message="SAM Everything 생성중입니다..." />
      )}
    </Container>
  );
}
