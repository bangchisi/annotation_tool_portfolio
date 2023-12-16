import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { restoreCompoundPaths } from 'routes/Annotator/components/Workbench/Canvas/tools';
import useManageTool from 'routes/Annotator/components/Workbench/Canvas/tools/useManageTool';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';

const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

const createBrush = (point: paper.Point, radius: number) => {
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

  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const tool = useManageTool(Tool.Brush);
  tool.minDistance = 3;

  // 마우스 움직임
  tool.onMouseMove = function (event: paper.MouseEvent) {
    // brush cursor 이미 있으면 제거
    if (this.cursor) {
      this.cursor.remove();
    }

    // brush cursor 생성
    this.cursor = createBrush(event.point, brushRadius);
  };

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

      if (!this.tempPath) return;

      const brush = new paper.Path.Circle({
        center: event.point,
        radius: brushRadius,
      });

      brush.smooth({
        type: 'continuous',
      });
      brush.simplify(3);
      brush.flatten(0.65);

      const pathToSwitch = new paper.CompoundPath(this.tempPath.unite(brush));

      this.tempPath.children = pathToSwitch.children;
      pathToSwitch.remove();

      brush.remove();
    });
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    if (!this.tempPath) return;

    // // brush cursor 이미 있으면 제거
    if (this.cursor) {
      this.cursor.remove();
    }

    // brush cursor 생성
    this.cursor = createBrush(event.point, brushRadius);

    const brush = new paper.Path.Circle({
      center: event.point,
      radius: brushRadius,
    });

    brush.smooth({
      type: 'continuous',
    });
    brush.simplify(3);
    brush.flatten(0.65);

    // 바꿔치기 할 children 생성
    const pathToSwitch = new paper.CompoundPath(this.tempPath.unite(brush));

    // children 바꿔치기고 pathToSwitch 삭제
    this.tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();

    // 임시 원 삭제
    brush.remove();
  };

  tool.onMouseUp = function () {
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  return tool;
};

export default useBrushTool;
