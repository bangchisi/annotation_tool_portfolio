import paper from 'paper';
import { AppDispatch } from 'store';

// radius will change when preferences panel is implemented.
let selection: paper.PathItem | null = null;
let brushCursor: paper.Path.Circle | null = null;
const radius = 20;
const fillColor = new paper.Color(1, 1, 1, 0.2);
const strokeColor = new paper.Color(1, 1, 1, 1);
const strokeWidth = 2;

// 최종 selection을 annotation의 path로 추가하면 됨

export const onBrushMouseMove = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);
};

export const onBrushMouseDown = (event: paper.MouseEvent) => {
  console.group('%cbrush down', 'color: red');
  // selection이 없을때만 selection을 현재 위치 원으로 생성
  if (!selection) {
    selection = new paper.Path.Circle({
      center: event.point,
      radius,
      fillColor,
      strokeColor,
      strokeWidth,
    });
  }
  console.groupEnd();
};

// 마우스 버튼 뗌
export const onBrushMouseUp = () => {
  console.group('%cbrush up', 'color: red');
  // selection이 있으면 path에 mouse event 할당
  if (selection) {
    selection.onMouseEnter = () => {
      if (selection) selection.selected = true;
    };

    selection.onMouseLeave = () => {
      if (selection) selection.selected = false;
    };
  }
  // brush cursor 제거
  if (brushCursor) {
    brushCursor.remove();
    brushCursor = null;
  }
  console.log(paper.project.activeLayer.children);
  console.groupEnd();
};

export const onBrushMouseDrag = (event: paper.MouseEvent) => {
  // brush cursor 이미 있으면 제거
  if (brushCursor !== null) {
    brushCursor.remove();
    brushCursor = null;
  }

  // brush cursor 생성
  brushCursor = createBrush(event.point, radius);

  // selection이 있을때만 새로운 brush를 unite
  if (selection) {
    const c1 = new paper.Path.Circle({
      center: event.point,
      radius,
    });

    const newSelection = selection.unite(c1);
    c1.remove();
    selection.remove();
    selection = newSelection;
  }
};

const createBrush = (point: paper.Point, radius: number) => {
  return new paper.Path.Circle({
    center: point,
    radius,
    strokeColor,
    strokeWidth,
    guide: true,
  });
};
