import paper from 'paper';
import { addAnnotation } from 'routes/Annotator/slices/annotationsSlice';
import { addBoxAnnotation } from 'routes/Annotator/slices/annotatorSlice';
import { AppDispatch } from 'store';

let brushCursor: paper.Path.Circle | null = null;
let brushSelection: paper.CompoundPath | null = null;
// radius will change when preferences panel is implemented.
const radius = 20;
const strokeWidth = 2;

export const onBrushMouseMove = (event: paper.MouseEvent) => {
  if (brushCursor !== null) {
    // remove brush cursor
    brushCursor.remove();
    brushCursor = null;
  }
  if (brushCursor === null) {
    // create brush cursor
    brushCursor = new paper.Path.Circle({
      center: event.point,
      radius,
      strokeWidth,
      strokeColor: new paper.Color(1, 1, 1, 1),
    });
  }
};

// TODO: unite compound's children to make one polygon not plenty of circles
export const onBrushMouseUp = (dispatch: AppDispatch) => {
  // append brush path to annotations
  // const newAnnotation = setAnnotation(11, 'bird', brushSelection);

  if (brushSelection) {
    // brushSelection.children = [];
    // const tempPath = new paper.Path(brushSelection.children);
    const unitedPath = brushSelection.children.reduce(
      (prevPath, currentPath) => {
        const tempPath1 = new paper.Path(prevPath);
        const tempPath2 = new paper.Path(currentPath);
        return tempPath1.unite(tempPath2);
      },
    );

    dispatch(addAnnotation(unitedPath));
    dispatch(addBoxAnnotation({ newAnnotation: unitedPath }));

    unitedPath.remove();

    brushSelection.onMouseDown = () => {
      console.log('brush Selection, mouse down');
    };

    brushSelection.onMouseEnter = () => {
      console.log('brush Selection, mouse enter');
      if (brushSelection) {
        brushSelection.selected = true;
      }
    };

    brushSelection.onMouseLeave = () => {
      console.log('brush Selection, mouse leave');
      if (brushSelection) {
        brushSelection.selected = false;
      }
    };
  }
  // dispatch(addAnnotation(newAnnotation));
};

export const onBrushMouseDrag = (event: paper.MouseEvent) => {
  const color = new paper.Color(1, 1, 1, 0.5);

  let tempBrush: paper.Path | null;

  if (brushCursor) {
    brushCursor.position = event.point;
  }
  if (brushSelection === null) {
    tempBrush = createBrush(event, radius);
    brushSelection = new paper.CompoundPath(tempBrush);
    brushSelection.fillColor = color;
    tempBrush.remove();
    tempBrush = null;
  } else {
    // brushSelection?.addTo(paper.project);
    tempBrush = createBrush(event, radius);
    brushSelection.addChild(createBrush(event, radius));
    tempBrush.remove();
    tempBrush = null;
  }
};

const createBrush = (event: paper.MouseEvent, radius: number) => {
  const { point } = event;
  return new paper.Path.Circle({
    center: point,
    radius,
    fillColor: new paper.Color(1, 0, 0, 1),
  });
};
