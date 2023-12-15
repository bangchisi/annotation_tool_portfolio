import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { selectAuth } from 'routes/Auth/slices/authSlice';
import { Tool } from 'types';

export let brushCursor: paper.Path.Circle | null = null;
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 paper..children에 추가
let tempPath: paper.CompoundPath | null;

const useBrushTool = () => {
  // Brush radius
  const { brushRadius } = useAppSelector(selectAuth).preference;

  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const tool = new AnnotationTool(Tool.Brush);

  // 마우스 움직임
  tool.onMouseMove = function (event: paper.MouseEvent) {
    // brush cursor 이미 있으면 제거
    if (brushCursor) {
      brushCursor.remove();
    }

    // brush cursor 생성
    brushCursor = createBrush(event.point, brushRadius);
  };

  // 마우스 클릭
  // TODO: 클릭 하자마자 해당 위치에 브러쉬 생성 시작
  tool.onMouseDown = function (event: paper.MouseEvent) {
    if (!currentCategory || !currentAnnotation) return;

    console.log(currentCategory.categoryId);

    this.startDrawing(() => {
      const { annotationId: currentAnnotationId } = currentAnnotation;
      const { categoryId: currentCategoryId } = currentCategory;

      // tempPath를 현재 compound로 선택
      const compounds = paper.project.activeLayer.children;
      window['paper'] = paper;
      tempPath = compounds.find((compound) => {
        const { categoryId, annotationId } = compound.data;
        if (
          categoryId === currentCategoryId &&
          annotationId === currentAnnotationId
        ) {
          return compound;
        }
      }) as paper.CompoundPath;

      if (!tempPath) return;

      let brush: paper.Path | null = new paper.Path.Circle({
        center: event.point,
        radius: brushRadius,
      });

      brush.smooth({
        type: 'continuous',
      });
      brush.simplify(3);
      brush.flatten(0.65);

      const pathToSwitch = new paper.CompoundPath(
        tempPath.unite(brush) as paper.CompoundPath,
      );

      tempPath.children = pathToSwitch.children;
      pathToSwitch.remove();

      brush.remove();
      brush = null;
    });
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    if (!tempPath) return;

    // // brush cursor 이미 있으면 제거
    if (brushCursor) {
      brushCursor.remove();
    }

    // brush cursor 생성
    brushCursor = createBrush(event.point, brushRadius);

    let brush: paper.Path | null = new paper.Path.Circle({
      center: event.point,
      radius: brushRadius,
    });

    brush.smooth({
      type: 'continuous',
    });
    brush.simplify(3);
    brush.flatten(0.65);

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

  tool.onMouseUp = function () {
    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  return tool;
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
