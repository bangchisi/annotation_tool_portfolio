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

const createBrushCursor = (point: paper.Point, radius: number) => {
  return new paper.Path.Circle({
    center: point,
    radius,
    strokeColor,
    strokeWidth,
    guide: true,
  });
};

const useBrushTool = () => {
  // Brush radius
  const { brushRadius } = useAppSelector(selectAuth).preference;

  const { currentCategory, currentAnnotation, selectedTool } =
    useAppSelector(selectAnnotator);

  const tool = useManageTool(Tool.Brush);
  tool.minDistance = 3;

  const paintBrush = useCallback(
    (center: paper.Point) => {
      if (!tool.tempPath) return;

      const brush = new paper.Path.Circle({
        center,
        radius: brushRadius,
      });

      optimizePathItem(brush);

      const pathToSwitch = new paper.CompoundPath(tool.tempPath.unite(brush));

      tool.tempPath.children = pathToSwitch.children;
      pathToSwitch.remove();

      brush.remove();
    },
    [tool, brushRadius],
  );

  const paintBrushCursor = useCallback(
    (event: paper.MouseEvent) => {
      if (!AnnotationTool.isMouseOnCanvas) return;
      // 이전 cursor 제거
      tool?.cursor?.remove();
      // 새로운 cursor 생성
      tool.cursor = createBrushCursor(event.point, brushRadius);
    },
    [tool, brushRadius],
  );

  // 마우스 움직임
  tool.onMouseMove = paintBrushCursor;

  // 마우스 클릭
  // TODO: 클릭 하자마자 해당 위치에 브러쉬 생성 시작
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
          return compound;
        }
      });

      // CompoundPath가 존재하지 않는다면
      // (Undo, Redo에 의해 CompoundPath가 삭제된 경우를 뜻 함)
      this.tempPath =
        this.tempPath === undefined
          ? restoreCompoundPaths(currentCategory, currentAnnotationId)
          : this.tempPath;

      paintBrush(event.point);
    });
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    paintBrushCursor(event);
    paintBrush(event.point);
  };

  tool.onMouseUp = function () {
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  useEffect(() => {
    if (selectedTool === Tool.Brush) {
      const point = AnnotationTool.mousePoint;
      paintBrushCursor({ point } as paper.MouseEvent);
    }
  }, [selectedTool, paintBrushCursor, tool]);

  return tool;
};

export default useBrushTool;
