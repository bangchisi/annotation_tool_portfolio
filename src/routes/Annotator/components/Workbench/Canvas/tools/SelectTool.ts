import paper from 'paper';

// 마우스 버튼 누름
export const onSelectMouseDown = (event: paper.MouseEvent) => {
  console.log('SelectTool.ts, onSelectMouseDown', event);
};

// 마우스 드래그
export const onSelectMouseDrag = (
  event: paper.MouseEvent,
  initPoint: paper.Point | null,
) => {
  // view.center를 마우스 delta만큼 옮김
  if (initPoint) {
    const delta_x: number | null = initPoint.x - event.point.x;
    const delta_y: number | null = initPoint.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
  }
};
