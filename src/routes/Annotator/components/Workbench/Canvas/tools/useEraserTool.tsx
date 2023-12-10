import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { useCallback, useMemo } from 'react';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';

export let eraserCursor: paper.Path.Circle | null = null;
let tempPath: paper.CompoundPath | null;
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

const useEraserTool = (compounds: paper.Item[]) => {
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const { eraserRadius } = useAppSelector(selectAuth).preference;

  const createEraser = useCallback((point: paper.Point, radius: number) => {
    return new paper.Path.Circle({
      center: point,
      radius,
      strokeColor,
      strokeWidth,
      guide: true,
    });
  }, []);

  const tool = useMemo(() => new AnnotationTool(Tool.Eraser), []);

  // 마우스 클릭
  tool.onMouseDown = function () {
    if (!currentCategory || !currentAnnotation) return;

    this.startDrawing();

    const { annotationId: currentAnnotationId } = currentAnnotation;
    const { categoryId: currentCategoryId } = currentCategory;

    // tempPath를 현재 compound로 선택
    tempPath = compounds.find((compound) => {
      const { categoryId, annotationId } = compound.data;
      if (
        categoryId === currentCategoryId &&
        annotationId === currentAnnotationId
      ) {
        // data를 넣어줌
        // tempData = compound.data;
        return compound;
      }
    }) as paper.CompoundPath;
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    if (!tempPath) return;

    // // eraser cursor 이미 있으면 제거
    if (eraserCursor !== null) {
      eraserCursor.remove();
      eraserCursor = null;
    }
    // eraser cursor 생성
    eraserCursor = createEraser(event.point, eraserRadius);

    let eraser: paper.Path | null = new paper.Path.Circle({
      center: event.point,
      radius: eraserRadius,
    });

    eraser.smooth({
      type: 'continuous',
    });
    eraser.simplify(3);
    eraser.flatten(0.65);

    // 바꿔치기 할 children 생성
    const pathToSwitch = new paper.CompoundPath(
      tempPath.subtract(eraser) as paper.CompoundPath,
    );

    // children 바꿔치기고 pathToSwitch 삭제
    tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();

    // 임시 원 삭제
    eraser.remove();
    eraser = null;
  };

  tool.onMouseUp = function () {
    tempPath = null;
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  tool.onMouseMove = function (event: paper.MouseEvent) {
    // eraser cursor 이미 있으면 제거
    if (eraserCursor !== null) {
      eraserCursor.remove();
      eraserCursor = null;
    }

    // eraser cursor 생성
    eraserCursor = createEraser(event.point, eraserRadius);
  };

  return tool;
};

export default useEraserTool;
