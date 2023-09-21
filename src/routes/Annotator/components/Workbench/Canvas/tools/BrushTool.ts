import paper from 'paper';

export const onBrushMouseDrag = (
  event: paper.MouseEvent,
  initPoint: paper.Point | null,
  radius: number,
  // color: paper.Color,
): paper.PathItem => {
  // console.log('Brush Mouse Drag', event);
  const { point } = event;
  const circle = new paper.Path.Circle({
    center: point,
    radius,
    // fillColor: color,
    // strokeWidth: 0.5,
    // strokeColor: 'white',
  });

  return circle;
};

// export const BrushTool = () => {
//   let myPath: paper.Path | null = null;
//   const strokeColor = new paper.Color('black');

//   let brush_path: paper.Path.Circle | null = null;
//   const createBrush = (center?: paper.Point) => {
//     center = center || new paper.Point(0, 0);
//     brush_path = new paper.Path.Circle({
//       center: center,
//       strokeColor: strokeColor,
//       strokeWidth: 30,
//       radius: 10,
//     });
//   };

//   const createSelection = () => {
//     // do nothing
//   };

//   paper.view.onMouseDown = (event: paper.ToolEvent) => {
//     console.log('Polygon Mouse Down', event);
//     myPath = new paper.Path();
//     myPath.strokeColor = new paper.Color('black');
//   };

//   paper.view.onMouseDrag = (event: paper.ToolEvent) => {
//     console.log('Polygon Mouse Drag', event);
//     const circle = new paper.Path.Circle({
//       center: event.middlePoint,
//       radius: event.delta.length / 2,
//     });
//     circle.fillColor = new paper.Color('white');
//   };

//   paper.view.onMouseUp = (event: paper.ToolEvent) => {
//     console.log('Polygon Mouse Up', event);
//     const myCircle = new paper.Path.Circle({
//       center: event.point,
//       radius: 10,
//     });
//     myCircle.strokeColor = new paper.Color('black');
//     myCircle.fillColor = new paper.Color('white');
//   };
// };
