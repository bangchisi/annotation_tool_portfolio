import paper from 'paper';
import { AnnotationType } from 'routes/Annotator/Annotator.types';

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

    // create current box
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
  annotations: AnnotationType[],
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>,
) => {
  if (startPoint && endPoint) {
    // draw box
    const box = new paper.Path.Rectangle({
      from: startPoint,
      to: event.point,
      strokeWidth: 2,
      strokeColor: new paper.Color(1, 0, 0, 1),
    });

    // append box path to annotations
    const nextAnnotations = annotations.slice();
    nextAnnotations.push({
      path: box,
    });
    onAnnotationsChange(nextAnnotations);

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
