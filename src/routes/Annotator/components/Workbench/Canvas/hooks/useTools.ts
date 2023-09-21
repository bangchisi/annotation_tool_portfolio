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

  let brushSelection: paper.CompoundPath | null = null;
  // const brushCursor: paper.Path.Circle | null = null;

  // Box tool 관련 변수
  let currentBox: paper.Path.Rectangle | null;
  let finalBox: paper.Path.Rectangle | null;
  let startBoxPoint: paper.Point | null;
  let endBoxPoint: paper.Point | null;

  // 마우스 커서 움직임
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
    } else if (selectedTool === Tool.Box) {
      // ...
      if (!startBoxPoint) return;
      console.log('box move');
      if (startBoxPoint) {
        if (currentBox) {
          currentBox.remove();
          currentBox = null;
          // console.log('is currentBox removed?', currentBox);
        }

        currentBox = new paper.Path.Rectangle({
          from: startBoxPoint,
          to: event.point,
          strokeWidth: 2,
          strokeColor: new paper.Color(1, 1, 1, 1),
        });
        // console.log('is currentBox created?', currentBox);
      }
    }
  };

  // 마우스 클릭
  const onMouseDown = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      onSelectMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      // brush click
    } else if (selectedTool === Tool.Box) {
      if (!startBoxPoint) {
        console.log('box set start point', event.point);
        startBoxPoint = event.point;
      } else {
        console.log('box set end point', event.point);
        endBoxPoint = event.point;
      }
    }
  };

  // 마우스 클릭 해제
  const onMouseUp = (event: paper.MouseEvent) => {
    // console.log(event);
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      // add compoundPath to project.activeLayer.children
      brushSelection?.addTo(paper.project);
      console.dir(paper.project.activeLayer.children);
    } else if (selectedTool === Tool.Box) {
      if (startBoxPoint && endBoxPoint) {
        console.log('draw box');
        finalBox = new paper.Path.Rectangle({
          from: startBoxPoint,
          to: endBoxPoint,
          strokeWidth: 2,
          strokeColor: new paper.Color(1, 0, 0, 1),
        });
        startBoxPoint = null;
        endBoxPoint = null;

        if (currentBox) {
          currentBox.remove();
          currentBox = null;
          // console.log('is currentBox removed?', currentBox);
        }
        console.dir(paper.project.activeLayer.children);
      }
    }
  };

  // 마우스 드래그
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
