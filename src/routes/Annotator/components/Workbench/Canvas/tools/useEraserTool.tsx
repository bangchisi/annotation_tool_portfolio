import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { useCallback } from 'react';
import useManageTool from 'routes/Annotator/components/Workbench/Canvas/tools/useManageTool';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';

const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

const useEraserTool = () => {
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

  const tool = useManageTool(Tool.Eraser);

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

      if (!this.tempPath) return;

      const eraser = new paper.Path.Circle({
        center: event.point,
        radius: eraserRadius,
      });

      eraser.smooth({
        type: 'continuous',
      });
      eraser.simplify(3);
      eraser.flatten(0.65);

      const pathToSwitch = new paper.CompoundPath(
        this.tempPath.subtract(eraser),
      );

      this.tempPath.children = pathToSwitch.children;
      pathToSwitch.remove();

      eraser.remove();
    });
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    if (!this.tempPath) return;

    // // eraser cursor 이미 있으면 제거
    if (this.cursor) {
      this.cursor.remove();
    }
    // eraser cursor 생성
    this.cursor = createEraser(event.point, eraserRadius);

    const eraser = new paper.Path.Circle({
      center: event.point,
      radius: eraserRadius,
    });

    eraser.smooth({
      type: 'continuous',
    });
    eraser.simplify(3);
    eraser.flatten(0.65);

    // 바꿔치기 할 children 생성
    const pathToSwitch = new paper.CompoundPath(this.tempPath.subtract(eraser));

    // children 바꿔치기고 pathToSwitch 삭제
    this.tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();

    // 임시 원 삭제
    eraser.remove();
  };

  tool.onMouseUp = function () {
    this.tempPath = undefined;
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  tool.onMouseMove = function (event: paper.MouseEvent) {
    // eraser cursor 이미 있으면 제거
    if (this.cursor) {
      this.cursor.remove();
    }

    // eraser cursor 생성
    this.cursor = createEraser(event.point, eraserRadius);
  };

  return tool;
};

export default useEraserTool;
