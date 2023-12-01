import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  selectAnnotator,
  setCategories,
  setCurrentAnnotation,
  setCurrentAnnotationByAnnotationId,
  setCurrentCategory,
  setCurrentCategoryByCategoryId,
} from './slices/annotatorSlice';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import useReloadAnnotator from './hooks/useReloadAnnotator';
import useKeyEvent from './hooks/useKeyEvent';
import useManageAnnotation from './hooks/useManageAnnotation';
import {
  selectAuth,
  setBrushRadius,
  setEraserRadius,
} from 'routes/Auth/slices/authSlice';
import { unstable_usePrompt } from 'react-router-dom';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}
import paper from 'paper';

export default function Annotator() {
  const dispatch = useAppDispatch();
  const { isLoading, initData } = useReloadAnnotator();
  const { createEmptyAnnotation, onClickDeleteButton } = useManageAnnotation();
  const imageId = Number(useParams().imageId);
  const categories = useAppSelector((state) => state.annotator.categories);
  const { selectedTool, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  );
  const { brushRadius, eraserRadius } = useAppSelector(selectAuth).preference;

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

  useKeyEvent('Space', createEmptyAnnotation);

  useKeyEvent('BracketLeft', () => {
    if (selectedTool === Tool.Brush && brushRadius > 1) {
      dispatch(setBrushRadius(brushRadius - 1));
    } else if (selectedTool === Tool.Eraser && eraserRadius > 1) {
      dispatch(setEraserRadius(eraserRadius - 1));
    }
  });

  useKeyEvent('BracketRight', () => {
    if (selectedTool === Tool.Brush && brushRadius > 0) {
      dispatch(setBrushRadius(brushRadius + 1));
    } else if (selectedTool === Tool.Eraser && eraserRadius > 0) {
      dispatch(setEraserRadius(eraserRadius + 1));
    }
  });

  useKeyEvent('Backspace', () => {
    if (!currentCategory || !currentAnnotation) return;
    onClickDeleteButton(
      currentCategory.categoryId,
      currentAnnotation.annotationId,
    );
  });

  // @이슈: 브라우저 뒤로가기 시 경고창 띄우기
  // 지금은 너무 무식한 방법으로 구현했음
  // CommandStack으로 undo, redo를 구현할 때, history가 쌓이면
  // 이 때마다 event dispatch를 통해 현재 activeLayer에 마스킹이
  // 있는지 없는지 검사하고, redux에 저장하는 방식으로 구현하면
  // 최소 지금보다는 나아질 것 같음
  // const [isBlocking, setIsBlocking] = useState(false);
  // 특정 브라우저에서 작동하지 않을 수 있음
  // 브라우저 뒤로가기 막기
  // const usePromptProps = useMemo(
  //   () => ({
  //     when: isBlocking,
  //     message: '페이지를 벗어나면 작업한 내용이 저장되지 않습니다.',
  //   }),
  //   [isBlocking],
  // );
  // unstable_usePrompt(usePromptProps);

  // 브라우저 떠나기, 새로고침 막침
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = '페이지를 벗어나면 작업한 내용이 저장되지 않습니다.';

  //     return true;
  //   };
  //   if (!isBlocking) return;

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     if (!isBlocking) return;
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [isBlocking]);
  // useEffect(() => {
  //   const checkShouldBlock = () => {
  //     console.log('checkShouldBlock');
  //     // 모든 레이어의 모든 패스가 비어있는지 검사
  //     // 그 말은 이미지 위에 마스킹이 없다는 뜻
  //     const layerIsEmpty =
  //       // 모든 레이어를 순회하면서
  //       paper.project.activeLayer.children.every((child) => {
  //         // 컴파운드 패스만 검사
  //         if (child instanceof paper.CompoundPath) {
  //           // 컴파운드 패스의 모든 패스가 비어있는지 검사
  //           const pathIsEmpty = child.children.every((path) => path.isEmpty());
  //           return pathIsEmpty;
  //         }
  //         return true;
  //       });

  //     console.log('layerIsEmpty', layerIsEmpty);

  //     // 레이어가 비어있다면 브라우저 뒤로가기를 막지 않음
  //     // 레이어가 비어있지 않다면 브라우저 뒤로가기를 막음
  //     const shouldBlock = layerIsEmpty ? false : true;

  //     console.log('shouldBlock', shouldBlock);

  //     if (isBlocking === shouldBlock) return;
  //     setIsBlocking(shouldBlock);
  //   };
  //   window.addEventListener('mouseup', checkShouldBlock);

  //   return () => {
  //     window.removeEventListener('mouseup', checkShouldBlock);
  //   };
  // }, []);

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
