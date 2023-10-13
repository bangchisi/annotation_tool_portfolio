import paper from 'paper';
import { Tool } from 'routes/Annotator/Annotator';
import { onSelectMouseDown, onSelectMouseDrag } from '../tools/SelectTool';
import {
  onBrushMouseDown,
  onBrushMouseDrag,
  onBrushMouseMove,
  onBrushMouseUp,
} from '../tools/BrushTool';
import { onBoxMouseDown, onBoxMouseUp, onBoxMouseMove } from '../tools/BoxTool';
import { AnnotationType, CategoryType } from 'routes/Annotator/Annotator.types';
import { useAppDispatch } from 'App.hooks';
import { onEraserMouseDrag, onEraserMouseMove } from '../tools/EraserTool';

interface UseToolsProps {
  initPoint: paper.Point | null;
  selectedTool: Tool;
  onChangePoint: (point: paper.Point) => void;
  currentAnnotation?: AnnotationType;
  currentCategory?: CategoryType;
  // containerWidth: number | null;
  // containerHeight: number | null;
}

export const useTools = (props: UseToolsProps) => {
  const {
    selectedTool,
    onChangePoint,
    initPoint,
    currentAnnotation,
    currentCategory,
    // containerWidth,
    // containerHeight,
  } = props;

  const dispatch = useAppDispatch();
  // 마우스 커서 움직임
  const onMouseMove = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseMove(event);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseMove(event);
    } else if (selectedTool === Tool.Eraser) {
      onEraserMouseMove(event);
    }
  };

  // 마우스 클릭
  const onMouseDown = (event: paper.MouseEvent) => {
    onChangePoint(event.point);
    if (selectedTool === Tool.Select) {
      onSelectMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseDown(event);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseDown(event);
    }
  };

  // 마우스 클릭 해제
  const onMouseUp = (event: paper.MouseEvent) => {
    // console.log(event);
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseUp(currentAnnotation);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseUp(event, dispatch, currentAnnotation);
    }
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      onSelectMouseDrag(event, initPoint);
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseDrag(event);
    } else if (selectedTool === Tool.Eraser) {
      onEraserMouseDrag(event, currentAnnotation);
    }
  };

  return { onMouseMove, onMouseDown, onMouseUp, onMouseDrag };
};

// tempPath -> segments 변환
export function tempPathToSegmentation(segments: paper.Segment[]): number[] {
  const segmentation: number[] = [];
  segments.map((segment) => {
    segmentation.push(segment.point.x);
    segmentation.push(segment.point.y);
  });

  return segmentation;
}

// const onToolsMouseMove = (
//   event: paper.MouseEvent,
//   onChangePoint: (point: paper.Point) => void,
//   // containerWidth: number | null,
//   // containerHeight: number | null,
// ) => {
//   const { point } = event;
//   // let tempPoint: paper.Point | null = null;

//   // if (containerWidth && containerHeight) {
//   //   const containerPoint = new paper.Point(
//   //     containerWidth / 2,
//   //     containerHeight / 2,
//   //   );

//   //   // 이미지 가운데가 (0, 0)인 좌표로 변환
//   //   tempPoint = point.subtract(containerPoint);
//   //   onChangePoint(tempPoint);
//   //   // console.log('SelectTool.ts, onSelectMouseMove, tempPoint: ', tempPoint);
//   // } else {
//   //   // 그냥 그대로, 혹시 모르니
//   //   onChangePoint(point);
//   // }
//   onChangePoint(point);
// };
