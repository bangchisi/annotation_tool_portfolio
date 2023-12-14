import paper from 'paper';
import { useMemo, useRef, useState } from 'react';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import { Tool } from 'types';

const useSelectTool = () => {
  const { currentCategory } = useReloadAnnotator();
  const { selectAnnotation } = useManageAnnotation();
  const [isDrag, setIsDrag] = useState(false);

  // delta 구하기 위한 마우스 시작 지점
  const startingPoint = useRef<paper.Point>();

  const tool = useMemo(() => new AnnotationTool(Tool.Select), []);

  // 마우스 다운
  tool.onMouseDown = function (event: paper.MouseEvent) {
    startingPoint.current = event.point;
    this.startDrawing();
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    setIsDrag(true);
    // view.center를 마우스 delta만큼 옮김
    if (!startingPoint.current) return;

    const delta_x: number | null = startingPoint.current.x - event.point.x;
    const delta_y: number | null = startingPoint.current.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
  };

  tool.onMouseUp = function (event: paper.MouseEvent) {
    if (!isDrag) {
      // get compoundPath from hitResult and make it selected
      const hitResult = paper.project.hitTest(event.point, {
        fill: true,
        stroke: true,
        segments: true,
        tolerance: 5,
      });

      let categoryId: number;
      let annotationId: number;

      paper.project.selectedItems.forEach((item) => (item.selected = false));
      if (hitResult && hitResult.item instanceof paper.CompoundPath) {
        hitResult.item.selected = true;

        categoryId = hitResult.item.data.categoryId;
        annotationId = hitResult.item.data.annotationId;
        selectAnnotation(categoryId, annotationId);
      } else {
        if (!currentCategory) return;

        selectAnnotation(currentCategory.categoryId, -1);
      }

      this.endDrawing(0);
    }
    setIsDrag(false);
  };

  return tool;
};

export default useSelectTool;
