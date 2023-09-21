import paper from 'paper';

/** Box 그리는 흐름
 * 1. 첫 클릭 = start 정함
 * 2. 두번째 클릭 = end 정함
 * 3. start, end로 Box 생성
 */

// 변수 초기화
let isDrawing = false; // 그리기 모드 여부
let startPoint: paper.Point | null = null; // 첫 번째 지점
let currentBox: paper.Path.Rectangle | null = null; // 현재 그리고 있는 박스

// 마우스 다운 이벤트 핸들러
export const onBoxMouseDown = (event: paper.MouseEvent) => {
  console.log('box start');
  if (!isDrawing) {
    // 그리기 모드 시작
    startPoint = event.point;
    isDrawing = true;
  }
};

// 마우스 무브 이벤트 핸들러
console.log('box move');
export const onBoxMouseMove = (event: paper.MouseEvent) => {
  if (isDrawing) {
    if (currentBox) {
      // 이미 그리고 있는 박스가 있으면 제거
      currentBox.remove();
    }

    // 현재 위치까지 박스 그리기
    currentBox = new paper.Path.Rectangle({
      from: startPoint,
      to: event.point,
      strokeColor: 'black',
    });
  }
};

// // 마우스 업 이벤트 핸들러
export const onBoxMouseUp = (event: paper.MouseEvent) => {
  console.log('box end');
  if (isDrawing) {
    // 그리기 모드 종료
    isDrawing = false;

    // 최종 박스 그리기
    if (currentBox) {
      currentBox.remove();
      new paper.Path.Rectangle({
        from: startPoint,
        to: event.point,
        strokeColor: 'black',
      });
      startPoint = null; // 첫 번째 지점 초기화
    }
  }
};
