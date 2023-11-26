import { useRef } from 'react';
import paper from 'paper';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';

const useSelectTool = () => {
  const { selectAnnotation } = useManageAnnotation();
  // delta 구하기 위한 마우스 시작 지점
  const startingPoint = useRef<paper.Point>();

  // 마우스 다운
  const onMouseDown = (event: paper.MouseEvent) => {
    startingPoint.current = event.point;
    // get compoundPath from hitResult and make it selected
    const hitResult = paper.project.hitTest(event.point, {
      fill: true,
      stroke: true,
      segments: true,
      tolerance: 5,
    });

    // if hitResult is not null and is CompoundPath, disable previous selected item and select new item
    // set currentAnnotation with selected item's data.annotationId property
    if (hitResult && hitResult.item instanceof paper.CompoundPath) {
      // disable previous selected item
      if (paper.project.selectedItems.length > 0) {
        paper.project.selectedItems[0].selected = false;
      }
      // select new item
      hitResult.item.selected = true;

      // set currentAnnotation with selected item's data property
      const categoryId = hitResult.item.data.categoryId;
      const annotationId = hitResult.item.data.annotationId;
      selectAnnotation(categoryId, annotationId);
    }
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
