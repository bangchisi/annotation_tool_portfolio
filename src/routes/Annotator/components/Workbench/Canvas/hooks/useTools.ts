import paper from 'paper';
import { Tool } from 'routes/Annotator/Annotator';
import { onSelectMouseDown, onSelectMouseDrag } from '../tools/SelectTool';
import {
  onBrushMouseDrag,
  onBrushMouseMove,
  onBrushMouseUp,
} from '../tools/BrushTool';
import { onBoxMouseDown, onBoxMouseUp, onBoxMouseMove } from '../tools/BoxTool';

interface UseToolsProps {
  initPoint: paper.Point | null;
  selectedTool: Tool;
  onChangePoint: (point: paper.Point) => void;
  // containerWidth: number | null;
  // containerHeight: number | null;
}

export const useTools = (props: UseToolsProps) => {
  const {
    selectedTool,
    onChangePoint,
    initPoint,
    // containerWidth,
    // containerHeight,
  } = props;

  // 마우스 커서 움직임
  const onMouseMove = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      // ...
      onBrushMouseMove(event);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseMove(event);
    }
  };

  // 마우스 클릭
  const onMouseDown = (event: paper.MouseEvent) => {
    onChangePoint(event.point);
    if (selectedTool === Tool.Select) {
      onSelectMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      // brush click
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
      onBrushMouseUp();
    } else if (selectedTool === Tool.Box) {
      onBoxMouseUp(event);
    }
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      onSelectMouseDrag(event, initPoint);
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseDrag(event);
    }
  };

  return { onMouseMove, onMouseDown, onMouseUp, onMouseDrag };
};

const onToolsMouseMove = (
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
