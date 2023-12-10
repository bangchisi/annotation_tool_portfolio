import { useAppSelector } from 'App.hooks';
import paper from 'paper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  unstable_BlockerFunction as BlockerFunction,
  useBlocker,
} from 'react-router-dom';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { MutationTypeTool } from 'types';

const unsavedChangeMessage =
  '페이지를 벗어나면 작업한 내용이 저장되지 않습니다.';

const useWarningOnUnsavedChange = () => {
  // 마지막으로 저장된 레이어의 해시값
  const [lastSavedLayerHash, setLastSavedLayerHash] = useState<string | null>(
    null,
  );

  // 브라우저 네비게이션을 막아야 하는지 여부를 위한 상태
  const [shouldBlock, setShouldBlock] = useState(false);
  useEffect(() => {
    console.log('shouldBlock', shouldBlock);
  }, [shouldBlock]);

  // 현재 목록에 있는 어노테이션들이 바뀌면
  // 브라우저 네비게이션 막아야하는지 확인하기
  // 어노테이션이 삭제 될 경우, 레이어 해시값이 바뀔 수도 있기 때문
  const { currentCategory } = useAppSelector(selectAnnotator);
  const annotationList = useMemo(() => {
    return Object.keys(currentCategory?.annotations ?? {});
  }, [currentCategory]);

  // 세이브 버튼을 누르면 현재 레이어의 해시값을
  // 마지막으로 저장된 레이어의 해시값으로 바꿈
  const handleSave = useCallback(() => {
    const currentLayerHash = AnnotationTool.getLayerHash();

    setShouldBlock(false);
    setLastSavedLayerHash(currentLayerHash);
  }, [setLastSavedLayerHash, setShouldBlock]);

  // 캔버스 변경을 감지함
  const detectChanges = useCallback(() => {
    const currentLayerHash = AnnotationTool.getLayerHash();

    const hasChange =
      lastSavedLayerHash !== null && lastSavedLayerHash !== currentLayerHash;

    if (shouldBlock !== hasChange) {
      setShouldBlock(hasChange);
    }
  }, [lastSavedLayerHash, shouldBlock, setShouldBlock]);

  // 어노테이션 변경사항을 감지함
  useEffect(() => {
    AnnotationTool.observeChange(detectChanges);
    return () => {
      AnnotationTool.stopObserve(detectChanges);
    };
  }, [annotationList, detectChanges]);

  // AnnotationList가 바뀔 때마다,
  // Save 버튼을 누를 때마다
  // 변경을 감지하여 shouldBlock을 업데이트
  useEffect(detectChanges, [annotationList, detectChanges]);

  // 툴을 사용할 때마다, 변경을 감지하여 shouldBlock을 업데이툴
  useEffect(() => {
    const checkLastSavedLayerHash = () => {
      if (lastSavedLayerHash === null) {
        const currentLayerHash = AnnotationTool.getLayerHash();
        setLastSavedLayerHash(currentLayerHash);
      }
    };
    // 그림 그리기 시작 전, 초기값 설정 (만약 초기값이 없다면)
    const handleStartDrawing = checkLastSavedLayerHash;
    // 그림 그리기가 끝나면, 레이어가 바뀌었는지 확인
    const handleEndDrawing = detectChanges;

    // 이벤트 등록
    paper.tools.forEach((tool) => {
      // 그림 그리기 툴이 아니면 무시
      const { toolType } = tool as AnnotationTool;
      if (!MutationTypeTool.includes(toolType)) return;

      tool.on('mousedown', handleStartDrawing);
      tool.on('mouseup', handleEndDrawing);
    });
    return () => {
      // 이벤트 제거
      paper.tools.forEach((tool) => {
        // 그림 그리기 툴이 아니면 무시
        const { toolType } = tool as AnnotationTool;
        if (!MutationTypeTool.includes(toolType)) return;

        tool.off('mousedown', handleStartDrawing);
        tool.off('mouseup', handleEndDrawing);
      });
    };
  }, [lastSavedLayerHash, shouldBlock, setShouldBlock, detectChanges]);

  /**************************************
   ****** 브라우저 네비게이션 막기 ********
   *************************************/

  /**
   * #1. react-router-dom의 useBlocker를 사용하여
   * 브라우저의 소프트 네비게이션을 막음
   *
   * #2. 브라우저에 직접 이벤트를 동록하여
   * 브라우저의 닫기, 새로고침을 막음 같은
   * 브라우저의 하드 네비게이션을 막음
   */

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

  // #2. 브라우저 닫기, 새로고침 막침
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

  return {
    shouldBlock,
    handleSave,
  };
};

export default useWarningOnUnsavedChange;
