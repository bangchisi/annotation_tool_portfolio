import paper from 'paper';

import {
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
import { setAnnotationDataToCompoundPath } from '../helpers/canvasHelper';
import { paths } from 'routes/Annotator/Annotator';
let brushCursor: paper.Path.Circle | null = null;
const radius = 20;
const fillColor = new paper.Color(1, 1, 1, 0.2);
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 tempPath를 annotation의 path로 추가하면 됨

export const onBrushMouseMove = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);
};

export const onBrushMouseDown = (event: paper.MouseEvent) => {
  console.group('%cbrush down', 'color: red');
  // tempPath 없을때만 tempPath를 현재 위치 원으로 생성

  if (!paths.tempPath) {
    paths.tempPath = new paper.CompoundPath(
      new paper.Path.Circle({
        center: event.point,
        radius,
        fillColor,
        strokeColor,
        strokeWidth,
      }),
    );
    paths.tempPath.fillColor = fillColor;
    paths.tempPath.strokeColor = strokeColor;
    paths.tempPath.strokeWidth = strokeWidth;
  }
  console.groupEnd();
};

// 마우스 버튼 뗌
export const onBrushMouseUp = (
  currentCategory?: CurrentCategoryType,
  currentAnnotation?: CurrentAnnotationType,
) => {
  console.group('%cbrush up', 'color: red');
  // tempPath가 있으면 path에 mouse event 할당
  if (!paths.tempPath) return;

  if (!currentCategory || !currentAnnotation) return;
  setAnnotationDataToCompoundPath(
    paths.tempPath,
    currentCategory.id,
    currentAnnotation.id,
  );

  // brush cursor 제거
  if (brushCursor) {
    brushCursor.remove();
    brushCursor = null;
  }

  console.log(paper.project.activeLayer.children);
  console.groupEnd();
};

export const onBrushMouseDrag = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);

  // tempPath가 있을때만
  if (paths.tempPath) {
    const c1 = new paper.CompoundPath(
      new paper.Path.Circle({
        center: event.point,
        radius,
      }),
    );

    // 새로운 brush를 unite
    const newSelection = new paper.CompoundPath(paths.tempPath.unite(c1));
    newSelection.fillColor = fillColor;
    newSelection.strokeColor = strokeColor;
    newSelection.strokeWidth = strokeWidth;

    c1.remove();
    paths.tempPath.remove();
    paths.tempPath = newSelection;
  }
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
