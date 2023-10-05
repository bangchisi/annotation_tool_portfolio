import paper from 'paper';
import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { updateCurrentAnnotationPath } from 'routes/Annotator/slices/annotatorSlice';
import { AppDispatch } from 'store';

export const onEraserMouseDown = (
  event: paper.MouseEvent,
  dispatch: AppDispatch,
  currentAnnotation?: AnnotationType,
) => {
  if (currentAnnotation) {
    if (currentAnnotation.path) {
      console.dir(currentAnnotation.path);
      const newSelection = currentAnnotation.path.subtract(
        new paper.Path.Circle(event.point, 10),
      );

      dispatch(updateCurrentAnnotationPath({ path: newSelection }));
    }
  }
};

export const onEraserDrag = (
  event: paper.MouseEvent,
  currentAnnotation?: AnnotationType,
) => {
  console.log('eraser drag', event);
  if (currentAnnotation) {
    if (currentAnnotation.path) {
      console.dir(currentAnnotation.path);
      currentAnnotation.path.subtract(new paper.Path.Circle(event.point, 10));
    }
  }
};
