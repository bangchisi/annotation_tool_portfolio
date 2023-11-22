import { useCallback, useEffect } from 'react';
import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';

let brushCursor: paper.Path.Circle | null = null;
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 paper..children에 추가
let tempPath: paper.CompoundPath | null;

const useBrushTool = (compounds: paper.Item[]) => {
  // Brush radius
  const { brushRadius } = useAppSelector(selectAuth).preference;

  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  // 마우스 움직임
  const onMouseMove = (event: paper.MouseEvent) => {
    // brush cursor 이미 있으면 제거
    if (brushCursor !== null) {
      brushCursor.remove();
      brushCursor = null;
    }

    // brush cursor 생성
    brushCursor = createBrush(event.point, brushRadius);
  };

  // 마우스 클릭
  const onMouseDown = () => {
    if (!currentCategory || !currentAnnotation) return;

    const { annotationId: currentAnnotationId } = currentAnnotation;
    const { categoryId: currentCategoryId } = currentCategory;

    // tempPath를 현재 compound로 선택
    tempPath = compounds.find((compound) => {
      const { categoryId, annotationId } = compound.data;
      if (
        categoryId === currentCategoryId &&
        annotationId === currentAnnotationId
      ) {
        return compound;
      }
    }) as paper.CompoundPath;
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (!tempPath) return;

    // // brush cursor 이미 있으면 제거
    if (brushCursor !== null) {
      brushCursor.remove();
      brushCursor = null;
    }
    // brush cursor 생성
    brushCursor = createBrush(event.point, brushRadius);

    let brush: paper.Path | null = new paper.Path.Circle({
      center: event.point,
      radius: brushRadius,
    });

    // 바꿔치기 할 children 생성
    const pathToSwitch = new paper.CompoundPath(
      tempPath.unite(brush) as paper.CompoundPath,
    );

    // children 바꿔치기고 pathToSwitch 삭제
    tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();
    // 임시 원 삭제
    brush.remove();
    brush = null;
  };

  // 마우스 버튼 뗌
  const onMouseUp = () => {
    tempPath = null;
  };

  const onMouseLeave = () => {
    if (brushCursor !== null) {
      brushCursor.remove();
      brushCursor = null;
    }
  };

  return { onMouseMove, onMouseDown, onMouseUp, onMouseDrag, onMouseLeave };
};

const createBrush = (point: paper.Point, radius: number) => {
  return new paper.Path.Circle({
    center: point,
    radius,
    strokeColor,
    strokeWidth,
    guide: true,
  });
};

export default useBrushTool;
