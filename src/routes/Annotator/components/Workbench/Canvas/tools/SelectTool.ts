import paper from 'paper';

export const onSelectMouseMove = (
  event: paper.MouseEvent,
  onChangePoint: (point: paper.Point) => void,
  // containerWidth: number | null,
  // containerHeight: number | null,
) => {
  const { point } = event;
  // let tempPoint: paper.Point | null = null;

  // if (containerWidth && containerHeight) {
  //   const containerPoint = new paper.Point(
  //     containerWidth / 2,
  //     containerHeight / 2,
  //   );

  //   // 이미지 가운데가 (0, 0)인 좌표로 변환
  //   tempPoint = point.subtract(containerPoint);
  //   onChangePoint(tempPoint);
  //   // console.log('SelectTool.ts, onSelectMouseMove, tempPoint: ', tempPoint);
  // } else {
  //   // 그냥 그대로, 혹시 모르니
  //   onChangePoint(point);
  // }
  onChangePoint(point);
};

// 마우스 버튼 누름
export const onSelectMouseDown = (event: paper.MouseEvent) => {
  console.log(
    'SelectTool.ts, onSelectMouseDown, actual point is ',
    event.point,
  );
};

// 마우스 드래그
export const onSelectMouseDrag = (
  event: paper.MouseEvent,
  initPoint: paper.Point | null,
) => {
  console.log('onMouseDrag', event);
  // view.center를 마우스 delta만큼 옮김
  if (initPoint) {
    const delta_x: number | null = initPoint.x - event.point.x;
    const delta_y: number | null = initPoint.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
    // console.log(paper.view.center);
  }
};
