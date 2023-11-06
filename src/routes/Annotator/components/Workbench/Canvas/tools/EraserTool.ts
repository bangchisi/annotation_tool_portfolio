import paper from 'paper';

import {
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
let eraserCursor: paper.Path.Circle | null = null;
const radius = 20; // eraser 크기는 preferece에서 받아올 것.
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 paper..children에 추가
let tempPath: paper.CompoundPath | null;

export const onEraserMouseMove = (event: paper.MouseEvent) => {
  // eraser cursor 이미 있으면 제거
  if (eraserCursor !== null) {
    eraserCursor.remove();
    eraserCursor = null;
  }

  // eraser cursor 생성
  eraserCursor = createEraser(event.point, radius);
};

// 마우스 클릭
export const onEraserMouseDown = (
  compounds: paper.Item[], // paper.project.activeLayer.children
  currentCategory?: CurrentCategoryType,
  currentAnnotation?: CurrentAnnotationType,
) => {
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
export const onEraserMouseDrag = (event: paper.MouseEvent) => {
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
export const onEraserMouseUp = () => {
  tempPath = null;
  // console.log(tempData);
  // console.log('activeLayer');
  // console.dir(paper.project.activeLayer.children);
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

// import paper from 'paper';

// import {
//   CurrentAnnotationType,
//   CurrentCategoryType,
// } from 'routes/Annotator/Annotator.types';
// import { setAnnotationDataToCompoundPath } from '../helpers/canvasHelper';
// // import { paths } from 'routes/Annotator/Annotator';
// // radius will change when preferences panel is implemented.
// let brushCursor: paper.Path.Circle | null = null;
// const radius = 20;
// const strokeColor = new paper.Color(1, 1, 1, 1);
// const strokeWidth = 2;

// export const onEraserMouseMove = (event: paper.MouseEvent) => {
//   // brush cursor 이미 있으면 제거
//   if (brushCursor !== null) {
//     brushCursor.remove();
//     brushCursor = null;
//   }

//   // brush cursor 생성
//   brushCursor = createBrush(event.point, radius);
// };

// export const onEraserMouseDrag = (
//   event: paper.MouseEvent,
//   currentCategory?: CurrentCategoryType,
//   currentAnnotation?: CurrentAnnotationType,
// ) => {
//   // brush cursor 이미 있으면 제거
//   if (brushCursor !== null) {
//     brushCursor.remove();
//     brushCursor = null;
//   }

//   // brush cursor 생성
//   brushCursor = createBrush(event.point, radius);

//   if (!currentCategory || !currentAnnotation) return;

//   // tempPath가 있을때만
//   // if (paths.tempPath) {
//   //   const c1 = new paper.CompoundPath(
//   //     new paper.Path.Circle({
//   //       center: event.point,
//   //       radius,
//   //     }),
//   //   );

//   //   const deletedPath = paths.tempPath.subtract(c1) as paper.CompoundPath;
//   //   c1.remove();
//   //   paths.tempPath.remove();
//   //   paths.tempPath = deletedPath;
//   //   setAnnotationDataToCompoundPath(
//   //     paths.tempPath,
//   //     currentCategory.id,
//   //     currentAnnotation.id,
//   //   );
//   // }
// };

// const createBrush = (point: paper.Point, radius: number) => {
//   return new paper.Path.Circle({
//     center: point,
//     radius,
//     strokeColor,
//     strokeWidth,
//     guide: true,
//   });
// };
