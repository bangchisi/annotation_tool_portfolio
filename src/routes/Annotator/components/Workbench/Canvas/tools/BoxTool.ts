import paper from 'paper';
import { CategoryType } from 'routes/Annotator/Annotator.types';
import {
  addAnnotation,
  addBoxAnnotation,
  setCurrentAnnotation,
  updateAnnotation,
} from 'routes/Annotator/slices/annotatorSlice';
import { AppDispatch } from 'store';

let currentBox: paper.Path.Rectangle | null;
let startPoint: paper.Point | null;
let endPoint: paper.Point | null;

export const onBoxMouseMove = (event: paper.MouseEvent) => {
  if (!startPoint) return;

  if (startPoint) {
    if (currentBox) {
      // remove current box
      currentBox.remove();
      currentBox = null;
    }

    // create current box again
    currentBox = new paper.Path.Rectangle({
      from: startPoint,
      to: event.point,
      strokeWidth: 2,
      strokeColor: new paper.Color(1, 1, 1, 1),
    });
  }
};

export const onBoxMouseDown = (event: paper.MouseEvent) => {
  if (!startPoint) {
    // set start point
    startPoint = event.point;
  } else {
    // set end point
    endPoint = event.point;
  }
};

export const onBoxMouseUp = (
  event: paper.MouseEvent,
  dispatch: AppDispatch,
  currentCategory?: CategoryType,
) => {
  if (startPoint && endPoint) {
    // draw box
    const box = new paper.CompoundPath(
      new paper.Path.Rectangle({
        from: startPoint,
        to: event.point,
      }),
    );

    box.strokeWidth = 2;
    box.strokeColor = new paper.Color(1, 0, 0, 1);

    // append box path to annotations

    dispatch(
      addAnnotation({
        newAnnotation: {
          id: currentCategory?.annotations.length,
          categoryId: currentCategory?.id,
          path: null,
        },
      }),
    );

    dispatch(
      setCurrentAnnotation({
        currentAnnotation: {
          id: currentCategory?.annotations.length,
          categoryId: currentCategory?.id,
          path: null,
        },
      }),
    );

    dispatch(updateAnnotation({ path: JSON.parse(JSON.stringify(box)) }));
    box.remove();
    startPoint = null;
    endPoint = null;

    if (currentBox) {
      // remove current box
      currentBox.remove();
      currentBox = null;
    }
    // console.dir(paper.project.activeLayer.children);
  }
};
