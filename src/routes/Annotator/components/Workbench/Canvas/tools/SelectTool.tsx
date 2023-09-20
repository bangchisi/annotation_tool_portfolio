import React from 'react';
import paper from 'paper';

interface SelectToolProps {
  initPoint: number | null;
  setInitPoint: (initPoint: paper.Point | null) => void;
}

export default function SelectTool(props: SelectToolProps) {
  const { initPoint, setInitPoint } = props;

  paper.view.onMouseMove = (event: paper.MouseEvent) => {
    setInitPoint(event.point);
  };

  // paper.view.onMouseDrag = (event: paper.MouseEvent) => {
  //   console.log('onMouseDrag', event);
  //   if (initPoint) {
  //     const delta_x: number | null = initPoint.x - event.point.x;
  //     const delta_y: number | null = initPoint.y - event.point.y;
  //     const center_delta = new paper.Point(delta_x, delta_y);
  //     const new_center = paper.view.center.add(center_delta);
  //     paper.view.center = new_center;
  //     console.log(paper.view.center);
  //   }
  // };
  return (
    <div>
      <div>SelectTool</div>
    </div>
  );
}
