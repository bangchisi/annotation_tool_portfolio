import { useCallback, useState } from 'react';
import paper from 'paper';

const useSelectTool = () => {
  const [p, setP] = useState<paper.Point>();

  // 마우스 다운
  const onMouseDown = useCallback(
    (event: paper.MouseEvent) => {
      setP(event.point);
    },
    [p],
  );

  // 마우스 드래그
  const onMouseDrag = useCallback(
    (event: paper.MouseEvent) => {
      // view.center를 마우스 delta만큼 옮김
      if (p) {
        const delta_x: number | null = p.x - event.point.x;
        const delta_y: number | null = p.y - event.point.y;
        const center_delta = new paper.Point(delta_x, delta_y);
        const new_center = paper.view.center.add(center_delta);
        paper.view.center = new_center;
      }
    },
    [p],
  );

  return {
    onMouseDown,
    onMouseDrag,
    onMouseUp: null,
    onMouseMove: null,
  };
};

export default useSelectTool;
