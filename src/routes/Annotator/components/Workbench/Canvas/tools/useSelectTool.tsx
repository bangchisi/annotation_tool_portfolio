import paper from 'paper';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Tool } from 'routes/Annotator/Annotator';
import { AnnotationTool } from 'routes/Annotator/components/Workbench/Canvas/hooks/useTools';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';

const useSelectTool = () => {
  const { currentCategory } = useReloadAnnotator();
  const { selectAnnotation } = useManageAnnotation();
  const [isDrag, setIsDrag] = useState(false);

  // delta 구하기 위한 마우스 시작 지점
  const startingPoint = useRef<paper.Point>();

  // 마우스 다운
  const onMouseDown = useCallback((event: paper.MouseEvent) => {
    startingPoint.current = event.point;
  }, []);

  // 마우스 드래그
  const onMouseDrag = useCallback((event: paper.MouseEvent) => {
    setIsDrag(true);
    // view.center를 마우스 delta만큼 옮김
    if (!startingPoint.current) return;

    const delta_x: number | null = startingPoint.current.x - event.point.x;
    const delta_y: number | null = startingPoint.current.y - event.point.y;
    const center_delta = new paper.Point(delta_x, delta_y);
    const new_center = paper.view.center.add(center_delta);
    paper.view.center = new_center;
  }, []);

  const onMouseUp = useCallback(
    (event: paper.MouseEvent) => {
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
          categoryId = hitResult.item.data.categoryId;
          annotationId = hitResult.item.data.annotationId;
          selectAnnotation(categoryId, annotationId);
        } else {
          // disable previous selected item and set currentAnnotation to null
          if (!currentCategory) return;

          if (paper.project.selectedItems.length > 0) {
            paper.project.selectedItems[0].selected = false;
          }
          selectAnnotation(currentCategory.categoryId, -1);
        }
      }
      setIsDrag(false);
    },
    [currentCategory, isDrag, selectAnnotation],
  );

  const tool = useMemo(() => {
    const tool = new AnnotationTool(Tool.Select);

    tool.onMouseDown = onMouseDown;
    tool.onMouseDrag = onMouseDrag;
    tool.onMouseUp = onMouseUp;

    return tool;
  }, [onMouseDown, onMouseDrag, onMouseUp]);

  return tool;
};

export default useSelectTool;
