import { useRef } from 'react';
import paper from 'paper';

const useSelectTool = () => {
  // delta 구하기 위한 마우스 시작 지점
  const startingPoint = useRef<paper.Point>();

  // 마우스 다운
  const onMouseDown = (event: paper.MouseEvent) => {
    startingPoint.current = event.point;
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    // view.center를 마우스 delta만큼 옮김
    if (!startingPoint.current) return;

    const delta_x: number | null = startingPoint.current.x - event.point.x;
    const delta_y: number | null = startingPoint.current.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
  };

  const onMouseMove = (event: paper.MouseEvent) => {
    //..
  };

  const onMouseUp = (event: paper.MouseEvent) => {
    //..
  };

  const onMouseLeave = (event: paper.MouseEvent) => {
    //..
    console.log('select leave');
  };

  return {
    onMouseDown,
    onMouseDrag,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
  };
};

export default useSelectTool;
