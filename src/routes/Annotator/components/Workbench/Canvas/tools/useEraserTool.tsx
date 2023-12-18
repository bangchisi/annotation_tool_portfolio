import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { useCallback, useEffect } from 'react';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { restoreCompoundPaths } from 'routes/Annotator/components/Workbench/Canvas/tools';
import useManageTool from 'routes/Annotator/components/Workbench/Canvas/tools/useManageTool';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';
import { optimizePathItem } from 'utils';

const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

const createEraser = (point: paper.Point, radius: number) => {
  return new paper.Path.Circle({
    center: point,
    radius,
    strokeColor,
    strokeWidth,
    guide: true,
  });
};

const useEraserTool = () => {
  const { currentCategory, currentAnnotation, selectedTool } =
    useAppSelector(selectAnnotator);

  const { eraserRadius } = useAppSelector(selectAuth).preference;

  const tool = useManageTool(Tool.Eraser);
  tool.minDistance = 3;

  const eraseArea = useCallback(
    (center: paper.Point) => {
      if (!tool.tempPath) return;

      const eraser = new paper.Path.Circle({
        center,
        radius: eraserRadius,
      });

      optimizePathItem(eraser);

      const pathToSwitch = new paper.CompoundPath(
        tool.tempPath.subtract(eraser),
      );

      tool.tempPath.children = pathToSwitch.children;
      pathToSwitch.remove();

      eraser.remove();
    },
    [tool, eraserRadius],
  );

  const paintEraserCursor = useCallback(
    (event: paper.MouseEvent) => {
      if (!AnnotationTool.isMouseOnCanvas) return;
      // 이전 cursor 제거
      tool?.cursor?.remove();
      // 새로운 cursor 생성
      tool.cursor = createEraser(event.point, eraserRadius);
    },
    [tool, eraserRadius],
  );

  // 마우스 움직임
  tool.onMouseMove = paintEraserCursor;

  // 마우스 클릭
  tool.onMouseDown = function (event: paper.MouseEvent) {
    if (!currentCategory || !currentAnnotation) return;

    this.startDrawing(() => {
      const { annotationId: currentAnnotationId } = currentAnnotation;
      const { categoryId: currentCategoryId } = currentCategory;

      // tempPath를 현재 compound로 선택
      const compounds = paper.project.activeLayer
        .children as paper.CompoundPath[];
      this.tempPath = compounds.find((compound) => {
        const { categoryId, annotationId } = compound.data;
        if (
          categoryId === currentCategoryId &&
          annotationId === currentAnnotationId
        ) {
          // data를 넣어줌
          // tempData = compound.data;
          return compound;
        }
      });

      // CompoundPath가 존재하지 않는다면
      // (Undo, Redo에 의해 CompoundPath가 삭제된 경우를 뜻 함)
      this.tempPath =
        this.tempPath === undefined
          ? restoreCompoundPaths(currentCategory, currentAnnotationId)
          : this.tempPath;

      eraseArea(event.point);
    });
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    paintEraserCursor(event);
    eraseArea(event.point);
  };

  tool.onMouseUp = function () {
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  useEffect(() => {
    if (selectedTool === Tool.Eraser) {
      const point = AnnotationTool.mousePoint;
      paintEraserCursor({ point } as paper.MouseEvent);
    }
  }, [selectedTool, paintEraserCursor, tool]);

  return tool;
};

export default useEraserTool;
