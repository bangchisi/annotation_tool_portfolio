import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import paper from 'paper';
import { useCallback, useEffect, useState } from 'react';
import type { unstable_BlockerFunction as BlockerFunction } from 'react-router-dom';
import { useBlocker, useParams } from 'react-router-dom';
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

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

const unsavedChangeMessage =
  '페이지를 벗어나면 작업한 내용이 저장되지 않습니다.';

export default function Annotator() {
  const dispatch = useAppDispatch();
  const { isLoading, initData } = useReloadAnnotator();
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const { selectedTool, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  );
  // @이슈: redux의 categories가 뒤로 가기 했을 때 초기화되지 않는 문때
  // init data
  useEffect(() => {
    setCategories(undefined);
    initData(imageId);

    return () => {
      dispatch(setCategories(undefined));
    };
  }, [imageId, dispatch]);

  useEffect(() => {
    if (!categories) {
      dispatch(setCurrentCategory(undefined));
      dispatch(setCurrentAnnotation(undefined));
    }
    if (!currentCategory) return;
    dispatch(setCurrentCategoryByCategoryId(currentCategory.categoryId));
    if (!currentAnnotation) return;
    dispatch(
      setCurrentAnnotationByAnnotationId(currentAnnotation.annotationId),
    );
  }, [categories]);

  useKeyEvents();

  // 페이지를 떠나기 전에 저장하지 않은 변경사항이 있는지 검사
  // 변경사항을 검사하는 코어 함수
  const hasUnsavedChange = useCallback(() => {
    // 모든 레이어의 모든 패스가 비어있는지 검사
    // 그 말은 이미지 위에 마스킹이 없다는 뜻
    // 모든 레이어를 순회하면서
    return !paper.project.activeLayer.children.every((child) => {
      // 컴파운드 패스만 검사
      if (child instanceof paper.CompoundPath) {
        // 컴파운드 패스의 모든 패스가 비어있는지 검사
        const pathIsEmpty = child.children.every((path) => path.isEmpty());
        return pathIsEmpty;
      }
      return true;
    });
  }, []);
  // # 브라우저 네비게이션 막기
  const [shouldBlock, setShouldBlock] = useState(false);
  const blockerFunction = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      return (
        // 저장하지 않은 변경사항이 없고,
        hasUnsavedChange() &&
        // 다음 페이지가 현재 페이지와 다를 때
        currentLocation.pathname !== nextLocation.pathname
      );
    },
    [hasUnsavedChange],
  );
  const blocker = useBlocker(blockerFunction);
  useEffect(() => {
    if (shouldBlock && blocker.state === 'blocked') {
      const confirmLeave = window.confirm(unsavedChangeMessage);
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [shouldBlock, blocker]);
  useEffect(() => {
    const checkShouldBlock = () => {
      const blockingState = hasUnsavedChange();
      if (shouldBlock === blockingState) return;

      setShouldBlock(blockingState);
    };

    window.addEventListener('mouseup', checkShouldBlock);
    return () => {
      window.removeEventListener('mouseup', checkShouldBlock);
    };
  }, [shouldBlock, hasUnsavedChange]);

  // # 브라우저 닫기, 새로고침 막침
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const shouldBlock = hasUnsavedChange();
      if (!shouldBlock) return;

      event.preventDefault();
      event.returnValue = unsavedChangeMessage;
      return unsavedChangeMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChange]);

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
