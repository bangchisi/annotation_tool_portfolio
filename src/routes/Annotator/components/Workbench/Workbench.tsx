import { useRef } from 'react';
import Canvas from './Canvas/Canvas';
import { Container } from './Workbench.style';

export default function Workbench() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Container ref={containerRef} onContextMenu={handleRightClick}>
      <Canvas containerRef={containerRef} />
    </Container>
  );
}
