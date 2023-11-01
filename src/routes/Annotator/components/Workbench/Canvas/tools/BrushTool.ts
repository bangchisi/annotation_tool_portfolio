import paper from 'paper';

import { CurrentAnnotationType } from 'routes/Annotator/Annotator.types';
let brushCursor: paper.Path.Circle | null = null;
const radius = 20; // brush 크기는 preferece에서 받아올 것.
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 paper..children에 추가
let tempPath: paper.CompoundPath | null;
// let tempData: { categoryId: number; annotationId: number; color: string };

export const onBrushMouseMove = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);
};

// 마우스 클릭
export const onBrushMouseDown = (
  compounds: paper.Item[], // paper.project.activeLayer.children
  currentAnnotation?: CurrentAnnotationType,
) => {
  if (!currentAnnotation) return;

  const { id: currentAnnotationId, categoryId: currentCategoryId } =
    currentAnnotation;

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
export const onBrushMouseDrag = (event: paper.MouseEvent) => {
  if (!tempPath) return;

  // // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }
  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);

  let brush: paper.Path | null = new paper.Path.Circle({
    center: event.point,
    radius,
  });

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

// 마우스 버튼 뗌
export const onBrushMouseUp = () => {
  tempPath = null;
  // console.log(tempData);
  console.log('activeLayer');
  console.dir(paper.project.activeLayer.children);
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
