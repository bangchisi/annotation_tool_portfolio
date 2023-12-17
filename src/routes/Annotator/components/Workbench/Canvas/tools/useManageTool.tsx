import { useAppSelector } from 'App.hooks';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';

/*
  툴이 안 되어야 하는 경우

  1. categories가 없는 경우
  2. annotation이 없는 경우
  3. current annotation이 없는 경우 (초기 로딩) 
  4. current category가 없는 경우 (초기 로딩)
  5. selectedTool이 Tool.Box가 아닌 경우 -> useEffect에서 마운트 후, cursor 제거
  6. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 다른 경우 (마우스 찍고 다른 카테고리로 이동) -> useEffect에서 마운트 후, cursor 제거
  7. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 같지만, (마우스 찍고 다른 어노테이션으로 이동) -> useEffect에서 마운트 후, cursor 제거
  현재 어노테이션의 어노테이션 아이디와 다른 경우
*/

const useManageTool = (currentTool: Tool) => {
  const { categories, selectedTool, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const tool = useRef(new AnnotationTool(currentTool)).current;
  const currentToolPreserved = useRef(currentTool).current;

  const removeTool = useCallback(() => {
    if (currentToolPreserved === selectedTool) {
      tool?.cursor?.remove();
    }
  }, [currentToolPreserved, selectedTool, tool]);

  const shouldBeActivated = useMemo(() => {
    const disableCases: (() => boolean)[] = [
      // 1. categories가 없는 경우
      // 2. annotation이 없는 경우
      () => !categories || Object.values(categories).length === 0,
      // 3. current annotation이 없는 경우 (초기 로딩)
      // 4. current category가 없는 경우 (초기 로딩)
      () => !currentCategory,
      () => !currentAnnotation,
      // 5. selectedTool이 Tool.Box가 아닌 경우 -> useEffect에서 마운트 후, cursor 제거
      () => selectedTool !== currentTool,
    ];
    const isNotDisable = !disableCases.some((disableTool) => disableTool());
    const isSelected = selectedTool === currentTool;

    const shouldBeActivated = isNotDisable && isSelected;

    return shouldBeActivated;
  }, [
    currentCategory,
    currentAnnotation,
    categories,
    selectedTool,
    currentTool,
  ]);

  useEffect(() => {
    // 6. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 다른 경우 (마우스 찍고 다른 카테고리로 이동) -> useEffect에서 마운트 후, cursor 제거
    // 7. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 같지만, (마우스 찍고 다른 어노테이션으로 이동) -> useEffect에서 마운트 후, cursor 제거
    // 현재 어노테이션의 어노테이션 아이디와 다른 경우
    if (!shouldBeActivated) {
      return;
    }

    tool.activate();

    return () => {
      removeTool();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBeActivated]);

  return tool;
};

export default useManageTool;
