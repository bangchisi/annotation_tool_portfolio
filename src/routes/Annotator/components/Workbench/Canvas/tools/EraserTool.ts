import paper from 'paper';

import {
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
import { setAnnotationDataToCompoundPath } from '../helpers/canvasHelper';
import { paths } from 'routes/Annotator/Annotator';
// radius will change when preferences panel is implemented.
let brushCursor: paper.Path.Circle | null = null;
const radius = 20;
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

export const onEraserMouseMove = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);
};

export const onEraserMouseDrag = (
  event: paper.MouseEvent,
  currentCategory?: CurrentCategoryType,
  currentAnnotation?: CurrentAnnotationType,
) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);

  if (!currentCategory || !currentAnnotation) return;

  // tempPath가 있을때만
  if (paths.tempPath) {
    const c1 = new paper.CompoundPath(
      new paper.Path.Circle({
        center: event.point,
        radius,
      }),
    );

    const deletedPath = paths.tempPath.subtract(c1) as paper.CompoundPath;
    c1.remove();
    paths.tempPath.remove();
    paths.tempPath = deletedPath;
    setAnnotationDataToCompoundPath(
      paths.tempPath,
      currentCategory.id,
      currentAnnotation.id,
    );
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
