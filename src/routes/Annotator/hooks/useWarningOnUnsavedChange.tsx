import { useAppSelector } from 'App.hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  unstable_BlockerFunction as BlockerFunction,
  useBlocker,
} from 'react-router-dom';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

const unsavedChangeMessage =
  '페이지를 벗어나면 작업한 내용이 저장되지 않습니다.';

const useWarningOnUnsavedChange = () => {
  const { currentCategory } = useAppSelector(selectAnnotator);

  // 현재 목록에 있는 어노테이션들이 바뀌면
  // 브라우저 네비게이션 막아야하는지 확인하기
  // 어노테이션이 삭제 될 경우, 레이어 해시값이 바뀔 수도 있기 때문
  const annotationList = useMemo(() => {
    return Object.keys(currentCategory?.annotations ?? {});
  }, [currentCategory]);

  const [shouldBlock, setShouldBlock] = useState<boolean>(false);

  // 마지막으로 저장된 레이어의 해시값
  const [lastSavedLayerHash, setLastSavedLayerHash] = useState<string>('');

  useEffect(() => {
    const { history } = AnnotationTool;
    const shouldBlock =
      // 초기 상태면 막지 않음
      history.undo.length > 0 ||
      // 저장하지 않은 변경사항이 있으면 막음
      lastSavedLayerHash !== AnnotationTool.getLayerHash();
    setShouldBlock(shouldBlock);
  }, [lastSavedLayerHash, setShouldBlock, annotationList]);

  useEffect(() => {
    const checkShouldBlock = () => {
      const { history } = AnnotationTool;
      const shouldBlock =
        history.undo.length > 0 &&
        lastSavedLayerHash !== AnnotationTool.getLayerHash();

      console.log('history.undo.length: ', history.undo.length);
      console.log('lastSavedLayerHash: ', lastSavedLayerHash);
      console.log(
        'AnnotationTool.getLayerHash(): ',
        AnnotationTool.getLayerHash(),
      );

      console.log('shouldBlock: ', shouldBlock);

      setShouldBlock(shouldBlock);
    };

    window.addEventListener('mouseup', checkShouldBlock);
    return () => {
      window.removeEventListener('mouseup', checkShouldBlock);
    };
  }, [lastSavedLayerHash, setShouldBlock]);

  useEffect(() => {
    console.log('shouldBlock: ', shouldBlock);
  }, [shouldBlock]);

  // 마운트 시, 초기 레이어의 해시값을 저장
  useEffect(() => {
    const initialLayerHash = AnnotationTool.getLayerHash();
    setLastSavedLayerHash(initialLayerHash);
  }, []);

  // #1. 브라우저 네비게이션 막기
  const blockerFunction = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      return (
        // 저장하지 않은 변경사항이 없고,
        shouldBlock &&
        // 다음 페이지가 현재 페이지와 다를 때
        currentLocation.pathname !== nextLocation.pathname
      );
    },
    [shouldBlock],
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

  // # 브라우저 닫기, 새로고침 막침
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!shouldBlock) return;

      event.preventDefault();
      event.returnValue = unsavedChangeMessage;
      return unsavedChangeMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock]);

  // 세이브 버튼을 누르거나
  const handleSave = useCallback(() => {
    const currentLayerHash = AnnotationTool.getLayerHash();
    setLastSavedLayerHash(currentLayerHash);
  }, [setLastSavedLayerHash]);

  return {
    shouldBlock,
    handleSave,
  };
};

export default useWarningOnUnsavedChange;
