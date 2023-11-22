import paper from 'paper';

import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

let eraserCursor: paper.Path.Circle | null = null;
const radius = 20; // eraser 크기는 preferece에서 받아올 것.
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 paper..children에 추가
let tempPath: paper.CompoundPath | null;

const useEraserTool = (compounds: paper.Item[]) => {
  const { currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

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
        // data를 넣어줌
        // tempData = compound.data;
        return compound;
      }
    }) as paper.CompoundPath;
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (!tempPath) return;

    // // eraser cursor 이미 있으면 제거
    if (eraserCursor !== null) {
      eraserCursor.remove();
      eraserCursor = null;
    }
    // eraser cursor 생성
    eraserCursor = createEraser(event.point, radius);

    let eraser: paper.Path | null = new paper.Path.Circle({
      center: event.point,
      radius,
    });

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

  // 마우스 버튼 뗌
  const onMouseUp = () => {
    tempPath = null;
  };

  const onMouseMove = (event: paper.MouseEvent) => {
    // eraser cursor 이미 있으면 제거
    if (eraserCursor !== null) {
      eraserCursor.remove();
      eraserCursor = null;
    }

    // eraser cursor 생성
    eraserCursor = createEraser(event.point, radius);
  };

  // 마우스 떠남
  const onMouseLeave = () => {
    console.log('onMouseLeave');

    if (eraserCursor !== null) {
      eraserCursor.remove();
      eraserCursor = null;
    }
  };

  return { onMouseDown, onMouseDrag, onMouseUp, onMouseMove, onMouseLeave };
};

const createEraser = (point: paper.Point, radius: number) => {
  return new paper.Path.Circle({
    center: point,
    radius,
    strokeColor,
    strokeWidth,
    guide: true,
  });
};

export default useEraserTool;