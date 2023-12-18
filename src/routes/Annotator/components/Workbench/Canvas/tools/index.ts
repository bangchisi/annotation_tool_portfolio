import paper from 'paper';
import { CurrentCategoryType } from 'routes/Annotator/Annotator.types';

// Undo, Redo 후에 현재 category에는 있는 annotation들에
// 대응되는 CompoundPath를 캔버스에 복구
// categories 전체를 복구하는 것이 아닌, 현재 category에는 있지만
// compounds로 존재하지 않는 annotation들만 복구
export function restoreCompoundPaths(
  currentCategory: CurrentCategoryType,
  currentAnnotationId: number,
) {
  const { categoryId, annotations: annotationsObjs } = currentCategory;
  const annotations = Object.values(annotationsObjs || []);

  const annotation = annotations.find((annotation) => {
    const { annotationId } = annotation;

    if (annotationId !== currentAnnotationId) return;

    return true;
  });

  if (!annotation) return;

  const { annotationId, color: annotationColor } = annotation;
  const data = {
    categoryId,
    annotationId,
    annotationColor,
  };

  // CompoundPath로 존재하지 않는 annotation은 복구
  const newTempPath = new paper.CompoundPath({});
  newTempPath.data = data;
  newTempPath.fillColor = new paper.Color(annotationColor);
  newTempPath.strokeColor = new paper.Color(1, 1, 1, 1);
  newTempPath.opacity = 0.5;

  return newTempPath;
}
