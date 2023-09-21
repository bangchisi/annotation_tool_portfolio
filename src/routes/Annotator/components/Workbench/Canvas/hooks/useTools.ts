import paper from 'paper';
import { Tool } from 'routes/Annotator/Annotator';
import {
  onSelectMouseDown,
  onSelectMouseDrag,
  onSelectMouseMove,
} from '../tools/SelectTool';

interface UseToolsProps {
  initPoint: paper.Point | null;
  selectedTool: Tool;
  onChangePoint: (point: paper.Point) => void;
  containerWidth: number | null;
  containerHeight: number | null;
}

export const useTools = (props: UseToolsProps) => {
  const {
    selectedTool,
    onChangePoint,
    initPoint,
    containerWidth,
    containerHeight,
  } = props;

  const onMouseMove = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // initPoint를 현재 마우스 위치로 항상 갱신
      onSelectMouseMove(event, onChangePoint, containerWidth, containerHeight);
      // onChangePoint(event.point);
    }
  };
  const onMouseDown = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 마우스 클릭
      onSelectMouseDown(event);
    }
  };
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      onSelectMouseDrag(event, initPoint);
    }
  };

  return { onMouseMove, onMouseDown, onMouseDrag };
};
