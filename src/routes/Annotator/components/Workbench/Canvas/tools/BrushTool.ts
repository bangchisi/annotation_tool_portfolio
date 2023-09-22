import paper from 'paper';
import { AnnotationType } from 'routes/Annotator/Annotator.types';

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

export const onBrushMouseUp = (
  annotations: AnnotationType[],
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>,
) => {
  // append brush path to annotations
  const nextAnnotations = annotations.slice();
  nextAnnotations.push({
    path: brushSelection,
  });
  onAnnotationsChange(nextAnnotations);
  // console.log(paper.project.activeLayer.children);
};

export const onBrushMouseDrag = (event: paper.MouseEvent) => {
  const color = new paper.Color(1, 1, 1, 0.5);

  let tempBrush: paper.Path.Circle | null;

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
