import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { useCallback, useEffect, useRef } from 'react';
import { restoreCompoundPaths } from 'routes/Annotator/components/Workbench/Canvas/tools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import useManageTool from './useManageTool';

const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

const useBoxTool = () => {
  const { currentCategory, currentAnnotation, selectedTool } =
    useAppSelector(selectAnnotator);

  const tool = useManageTool(Tool.Box);

  const startPointRef = useRef<paper.Point>();
  const endPointRef = useRef<paper.Point>();

  const drawGuideBox = useCallback(
    (event: paper.MouseEvent) => {
      if (!startPointRef.current) return;

      if (tool.cursor) {
        // remove guide box
        tool.cursor.remove();
      }

      // create guide box again which will be used as a cursor fore box tool
      tool.cursor = new paper.Path.Rectangle({
        from: startPointRef.current,
        to: event.point,
        strokeWidth,
        strokeColor,
      });
    },
    [tool, startPointRef],
  );

  useEffect(() => {
    tool.drawCursor = drawGuideBox;
  }, [tool, drawGuideBox]);

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

      if (!startPointRef.current) {
        // set start point
        startPointRef.current = event.point;
      } else {
        // set end point
        endPointRef.current = event.point;
      }
    });
  };

  // 마우스 움직임
  tool.onMouseMove = drawGuideBox;

  // 마우스 클릭 해제
  tool.onMouseUp = function () {
    if (!this.tempPath) return;

    // 두 번째 점이 없으면 무시
    if (!endPointRef.current || !this.cursor) return;

    // 바꿔치기 할 children 생성
    const unitedPath = this.tempPath.unite(this.cursor) as paper.CompoundPath;
    const pathToSwitch = new paper.CompoundPath(unitedPath);

    // guide box 삭제
    this.cursor.remove();

    startPointRef.current = undefined;
    endPointRef.current = undefined;

    // children 바꿔치기고 pathToSwitch 삭제
    this.tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();

    this.endDrawing(currentAnnotation?.annotationId || 0);
  };

  // 다른 툴로 이동할 때, start point와 end point를 초기화
  useEffect(() => {
    startPointRef.current = undefined;
    endPointRef.current = undefined;
    tool.cursor?.remove();
  }, [tool, selectedTool, currentCategory, currentAnnotation]);

  return tool;
};

export default useBoxTool;
