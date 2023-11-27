import { Container } from './Workbench.style';
import Canvas from './Canvas/Canvas';
import { useRef } from 'react';

export default function Workbench() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const width = containerRef.current?.clientWidth;
  const height = containerRef.current?.clientHeight;

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Container ref={containerRef} onContextMenu={handleRightClick}>
      <Canvas width={width} height={height} />
    </Container>
  );
}
