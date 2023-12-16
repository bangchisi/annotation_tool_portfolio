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
  const newTempPath = new paper.CompoundPath({
    data,
  });
  newTempPath.fillColor = new paper.Color(annotationColor);
  newTempPath.strokeColor = new paper.Color(1, 1, 1, 1);
  newTempPath.opacity = 0.5;

  return newTempPath;
}

/*
    기본적으론 위에 거랑 같지만 위에는 1개만 복구하는 거고, 이건 전체 복구
    Undo, Redo에 의해 사라진 CompoundPath들을 한번에 모두 복원
    startDrawing할 때마다 실행되니 뭔가 약간 비효율적인 것 같긴 함
    선택의 문제
*/
// export function restoreCompoundPaths(currentCategory: CurrentCategoryType) {
//   const { categoryId, annotations: annotationsObjs } = currentCategory;
//   const annotations = Object.values(annotationsObjs || []);

//   const compounds = paper.project.activeLayer.children;
//   const existingAnnotationIds = compounds?.map((compound) => {
//     return compound.data.annotationId;
//   }) as number[];

//   annotations.forEach((annotation) => {
//     const { annotationId, color: annotationColor } = annotation;
//     const data = {
//       categoryId,
//       annotationId,
//       annotationColor,
//     };

//     // CompoundPath로 존재하는 annotation은 복구하지 않음
//     if (existingAnnotationIds.includes(annotationId)) return;
//     // CompoundPath로 존재하지 않는 annotation은 복구
//     new paper.CompoundPath({
//       data,
//     });
//   });
// }
