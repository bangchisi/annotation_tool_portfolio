import paper from 'paper';
import {
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
// import { paths } from 'routes/Annotator/Annotator';
import { setAnnotationDataToCompoundPath } from '../helpers/canvasHelper';

let tempBox: paper.CompoundPath | null;
let currentBox: paper.Path.Rectangle | null;
let startPoint: paper.Point | null;
let endPoint: paper.Point | null;

// this should follow category color
const fillColor = new paper.Color(1, 1, 1, 0.2);
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

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
  currentCategory?: CurrentCategoryType,
  currentAnnotation?: CurrentAnnotationType,
) => {
  if (!currentCategory) return;

  if (startPoint && endPoint) {
    tempBox = new paper.CompoundPath(
      new paper.Path.Rectangle({
        from: startPoint,
        to: event.point,
      }),
    );

    // tempBox.fillColor = new paper.Color(currentCategory.color);
    // tempBox.strokeColor = new paper.Color(1, 1, 1, 1);
    // tempBox.strokeWidth = strokeWidth;

    // console.dir(paths.tempPath);
    // if (!paths.tempPath) {
    //   console.log('no paths, make first box');
    //   paths.tempPath = tempBox;
    // } else {
    //   console.log('paths, unite box!');
    //   const newPath = paths.tempPath?.unite(tempBox) as paper.CompoundPath;
    //   paths.tempPath?.remove();
    //   paths.tempPath = newPath;

    //   paths.tempPath.fillColor = new paper.Color(currentCategory.color);
    //   paths.tempPath.strokeColor = new paper.Color(1, 1, 1, 1);
    //   paths.tempPath.strokeWidth = strokeWidth;
    //   paths.tempPath.opacity = 0.5;
    //   tempBox.remove();
    // }

    // if (!currentCategory || !currentAnnotation) return;
    // setAnnotationDataToCompoundPath(
    //   paths.tempPath,
    //   currentCategory.id,
    //   currentAnnotation.id,
    // );
    // startPoint = null;
    // endPoint = null;

    // if (currentBox) {
    //   // remove current box
    //   currentBox.remove();
    //   currentBox = null;
    // }
    // console.dir(paper.project.activeLayer.children);

    // return paths.tempPath;
  }
};
