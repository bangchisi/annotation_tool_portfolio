import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { useRef } from 'react';
import { restoreCompoundPaths } from 'routes/Annotator/components/Workbench/Canvas/tools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import useManageTool from './useManageTool';

const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

/*

  툴이 안 되어야 하는 경우

  1. categories가 없는 경우 -> useEffect에서 마운트 후 확인
  1. annotation이 없는 경우 -> useEffect에서 마운트 후 확인
  2. current annotation이 없는 경우 (초기 로딩) -> 위의 useEffect에서 dependency array에 추가로
  3. current category가 없는 경우 (초기 로딩) -> 위의 useEffect에서 dependency array에 추가로
  4. selectedTool이 Tool.Box가 아닌 경우 -> useEffect에서 마운트 후, cursor 제거
  5. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 다른 경우 (마우스 찍고 다른 카테고리로 이동) -> useEffect에서 마운트 후, cursor 제거
  6. 현재 툴이 박스 툴이지만, 현재 어노테이션의 카테고리와 같지만, (마우스 찍고 다른 어노테이션으로 이동) -> useEffect에서 마운트 후, cursor 제거
  현재 어노테이션의 어노테이션 아이디와 다른 경우

*/

const useBoxTool = () => {
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const tool = useManageTool(Tool.Box);

  const startPointRef = useRef<paper.Point>();
  const endPointRef = useRef<paper.Point>();

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
  tool.onMouseMove = function (event: paper.MouseEvent) {
    if (!startPointRef.current) return;

    if (this.cursor) {
      // remove guide box
      this.cursor.remove();
    }

    // create guide box again which will be used as a cursor fore box tool
    this.cursor = new paper.Path.Rectangle({
      from: startPointRef.current,
      to: event.point,
      strokeWidth,
      strokeColor,
    });
  };

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

  return tool;
};

export default useBoxTool;
