import paper from 'paper';
import { useRef } from 'react';
import useManageTool from 'routes/Annotator/components/Workbench/Canvas/tools/useManageTool';
import useManageAnnotation, {
  deselectPathSegments,
} from 'routes/Annotator/hooks/useManageAnnotation';
import { Tool } from 'types';

const useSelectTool = () => {
  const { selectAnnotation } = useManageAnnotation();

  const tool = useManageTool(Tool.Select);

  // delta 구하기 위한 마우스 시작 지점
  const startingPoint = useRef<paper.Point>();
  const isDragging = useRef(false);

  // 마우스 다운
  tool.onMouseDown = function (event: paper.MouseEvent) {
    startingPoint.current = event.point;

    this.startDrawing(() => void 0);
  };

  // 마우스 드래그
  tool.onMouseDrag = function (event: paper.MouseEvent) {
    if (!startingPoint.current) return;
    isDragging.current = true;

    // view.center를 마우스 delta만큼 옮김
    const delta_x: number | null = startingPoint.current.x - event.point.x;
    const delta_y: number | null = startingPoint.current.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
  };

  tool.onMouseUp = function (event: paper.MouseEvent) {
    if (isDragging.current) {
      isDragging.current = false;
      this.endDrawing(0);
      return;
    }
    const hasHitImage = hitImage(event.point);
    // 빈 공간을 클릭하면 deselect
    if (hasHitImage) {
      deselectPathSegments();
      return;
    }

    // get compoundPath from hitResult and make it selected
    const hitResult = hitPathItem(event.point);

    if (
      !hitResult ||
      hitResult.item instanceof paper.Raster ||
      hitResult.item instanceof paper.Path
    )
      return;

    let categoryId: number;
    let annotationId: number;

    console.log('hitResult', hitResult);

    paper.project.selectedItems.forEach((item) => (item.selected = false));
    if (hitResult && hitResult.item instanceof paper.CompoundPath) {
      hitResult.item.selected = true;

      categoryId = hitResult.item.data.categoryId;
      annotationId = hitResult.item.data.annotationId;
      console.log('categoryId', categoryId, 'annotationId', annotationId);
      selectAnnotation(categoryId, annotationId);
    }
  };

  return tool;
};

const hitPathItem = (point: paper.Point) => {
  return paper.project.hitTest(point, {
    fill: true,
    stroke: true,
    segments: true,
    tolerance: 5,
  });
};

const hitImage = (point: paper.Point) => {
  const hitResult = hitPathItem(point);

  if (hitResult && hitResult.item instanceof paper.Raster) return true;
  else return false;
};

export default useSelectTool;
