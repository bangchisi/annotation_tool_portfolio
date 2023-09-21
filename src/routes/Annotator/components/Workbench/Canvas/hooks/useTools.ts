import paper from 'paper';
import { Tool } from 'routes/Annotator/Annotator';
import { onSelectMouseDown, onSelectMouseDrag } from '../tools/SelectTool';

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

  const onMouseMove = (event: paper.MouseEvent) => {
    // 툴에 관계 없이 mouse move하면 initPoint는 항상 갱신
    // onToolsMouseMove(event, onChangePoint, containerWidth, containerHeight);
    onToolsMouseMove(event, onChangePoint);
    if (selectedTool === Tool.Select) {
      // ...
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
