import { useCallback } from 'react';
import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

// preferece에서 가져올 값인가?
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

let tempPath: paper.CompoundPath | null;
// let tempData: { categoryId: number; annotationId: number; color: string };
let startPoint: paper.Point | null;
let endPoint: paper.Point | null;
let guideBox: paper.Path.Rectangle | null;

const useBoxTool = (compounds: paper.Item[]) => {
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  // 마우스 클릭
  const onMouseDown = useCallback(
    (event: paper.MouseEvent) => {
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
          // data를 넣어줌
          // tempData = compound.data;
          return compound;
        }
      }) as paper.CompoundPath;

      if (!startPoint) {
        // set start point
        startPoint = event.point;
      } else {
        // set end point
        endPoint = event.point;
      }
    },
    [currentCategory, currentAnnotation],
  );

  // 마우스 움직임
  const onMouseMove = useCallback((event: paper.MouseEvent) => {
    if (!startPoint) return;

    if (guideBox) {
      // remove guide box
      guideBox.remove();
    }

    // create guide box again
    guideBox = new paper.Path.Rectangle({
      from: startPoint,
      to: event.point,
      strokeWidth,
      strokeColor,
    });
  }, []);

  // 마우스 클릭 해제
  const onMouseUp = useCallback(() => {
    if (!tempPath) return;

    // 두 번째 점이 없으면 무시
    if (!endPoint || !guideBox) return;

    // 바꿔치기 할 children 생성
    const unitedPath = tempPath.unite(guideBox) as paper.CompoundPath;
    const pathToSwitch = new paper.CompoundPath(unitedPath);
    console.dir(paper.project.activeLayer.children);

    // guide box 삭제
    guideBox.remove();
    guideBox = null;

    startPoint = null;
    endPoint = null;

    // children 바꿔치기고 pathToSwitch 삭제
    tempPath.children = pathToSwitch.children;
    pathToSwitch.remove();
  }, []);

  return { onMouseUp, onMouseDown, onMouseMove, onMouseDrag: null };
};

export default useBoxTool;
