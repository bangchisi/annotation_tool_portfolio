import { useRef } from 'react';
import Canvas from './Canvas/Canvas';
import { Container } from './Workbench.style';

// 캔버스 컴포넌트
export default function Workbench() {
  const containerRef = useRef<HTMLDivElement | null>(null); // 캔버스 컨테이너 ref

  // 오른쪽 클릭 시 메뉴가 뜨는 것을 방지하는 핸들러
  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Container
      className="canvas-step"
      ref={containerRef}
      onContextMenu={handleRightClick}
    >
      {/* 실제 캔버스 */}
      <Canvas containerRef={containerRef} />
    </Container>
  );
}
