import paper from 'paper';
import { Tool } from 'routes/Annotator/Annotator';
import { onSelectMouseDown, onSelectMouseDrag } from '../tools/SelectTool';
import { onBrushMouseDrag } from '../tools/BrushTool';

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

  console.log('useTools()');

  let brushSelection: paper.CompoundPath | null = null;
  // const brushCursor: paper.Path.Circle | null = null;

  const onMouseMove = (event: paper.MouseEvent) => {
    // 툴에 관계 없이 mouse move하면 initPoint는 항상 갱신
    // onToolsMouseMove(event, onChangePoint, containerWidth, containerHeight);
    onToolsMouseMove(event, onChangePoint);
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      // if (brushCursor !== null) {
      //   // console.log('remove brush cursor');
      //   brushCursor.remove();
      //   brushCursor = null;
      // }
      // if (brushCursor === null) {
      //   // console.log('create brush cursor');
      //   brushCursor = new paper.Path.Circle({
      //     center: event.point,
      //     radius: 10,
      //     strokeWidth: 0.5,
      //     strokeColor: new paper.Color(1, 1, 1, 1),
      //   });
      // }
    }
  };
  const onMouseDown = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 마우스 클릭
      onSelectMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      // brush click
    }
  };

  const onMouseUp = (event: paper.MouseEvent) => {
    // 마우스 클릭 해제
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      // add compoundPath to project.activeLayer.children
      brushSelection?.addTo(paper.project);
    }

    console.dir(paper.project.activeLayer.children);
  };

  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      onSelectMouseDrag(event, initPoint);
    } else if (selectedTool === Tool.Brush) {
      // Draw circle
      const radius = 20;
      const color = new paper.Color(1, 1, 1, 0.5);
      if (brushSelection === null) {
        brushSelection = new paper.CompoundPath(
          onBrushMouseDrag(event, initPoint, radius),
        );

        brushSelection.fillColor = color;
      } else {
        // brushSelection.remove();
        brushSelection.addChild(onBrushMouseDrag(event, initPoint, radius));
      }
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
