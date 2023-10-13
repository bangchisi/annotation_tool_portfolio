import paper from 'paper';
import { AnnotationType } from 'routes/Annotator/Annotator.types';
// import {
//   addAnnotation,
//   setCurrentAnnotation,
//   updateCurrentAnnotationPath,
// } from 'routes/Annotator/slices/annotatorSlice';
import { AppDispatch } from 'store';
import { paths } from 'routes/Annotator/Annotator';

let tempPath: paper.CompoundPath | null;
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
  currentAnnotation?: AnnotationType,
) => {
  if (startPoint && endPoint) {
    // draw box
    tempPath = new paper.CompoundPath(
      new paper.Path.Rectangle({
        from: startPoint,
        to: event.point,
      }),
    );

    tempPath.strokeWidth = 2;
    tempPath.strokeColor = new paper.Color(1, 0, 0, 1);

    // append box path to annotations
    // add new empty annotation
    // FIX: currentCategory?.annotations is removed
    // dispatch(
    //   addAnnotation({
    //     id: currentCategory?.annotations.length,
    //     categoryId: currentCategory?.id,
    //     path: null,
    //   }),
    // );
    // set current annotation to new empty annotation just added
    // FIX: currentCategory?.annotations is removed
    // dispatch(
    //   setCurrentAnnotation({
    //     id: currentCategory?.annotations.length,
    //     categoryId: currentCategory?.id,
    //     path: null,
    //   }),
    // );

    // dispatch(updateAnnotation({ path: JSON.parse(JSON.stringify(box)) }));
    // dispatch(updateAnnotation({ path: box }));
    console.log(currentAnnotation);
    console.dir(tempPath);
    tempPath = null;
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
