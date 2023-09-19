import { Container } from './Workbench.style';
import Canvas from './Canvas/Canvas';
import { useEffect, useRef, useState } from 'react';

export default function Workbench() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(containerRef.current.clientHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  return (
    <Container ref={containerRef}>
      <Canvas
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
    </Container>
  );
}
