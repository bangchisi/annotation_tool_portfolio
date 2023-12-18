import { useAppSelector } from 'App.hooks';
import paper from 'paper';
import { useEffect, useMemo, useRef } from 'react';
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

  // Canvas에 mouseleave이벤트를 등록해도,
  // 마우스 커서를 생성하는 이벤트 핸들러가 paper.Tool에 바인딩 되어 있기
  // 때문에, canvas.mouseleave 이벤트 핸들러가 커서를 없애도
  // paper.Tool의 mousemove에 바인딩 된 핸들러가 커서를 다시
  // 만들어낸다. 이를 해결하기 위해, 전역처럼 사용할 수 있는
  // 플래그를 사용한다. (AnnotationTool의 정적 변수)
  useEffect(() => {
    const handleMouseEnter = () => {
      AnnotationTool.isMouseOnCanvas = true;
    };
    const handleMouseLeave = () => {
      AnnotationTool.isMouseOnCanvas = false;
      const CursorTypesToRemove = [Tool.Brush, Tool.Eraser];
      if (!CursorTypesToRemove.includes(currentTool)) return;
      tool.cursor?.remove();
    };

    const target = paper.project.view.element;

    target?.addEventListener('mouseenter', handleMouseEnter);
    target?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      target?.removeEventListener('mouseenter', handleMouseEnter);
      target?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [tool.cursor, currentTool]);

  const shouldBeActivated = useMemo(() => {
    const disableCases: (() => boolean)[] = [
      // 1. categories가 없는 경우
      // 2. annotation이 없는 경우
      () => !categories || Object.values(categories).length === 0,
      // 3. current annotation이 없는 경우 (초기 로딩)
      // 4. current category가 없는 경우 (초기 로딩)
      () => !currentCategory,
      // Select 툴의 경우, currentAnnotation이 없어도 activate 되어야 함
      () => !currentAnnotation && currentTool !== Tool.Select,
      // 5. selectedTool이 Tool.Box가 아닌 경우 -> activate 되지 않음
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
      // tool.deactivate() 혹은 tool.remove()를 안 해줘도 되는 이유되
      // 마지막으로 activate된 툴이 paperjs가 인식하는 active tool이기 때문
      tool.cursor?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldBeActivated]);

  return tool;
};

export default useManageTool;
