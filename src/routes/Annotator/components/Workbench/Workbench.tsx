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

// export default function Workbench() {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [containerWidth, setContainerWidth] = useState<number | null>(null);
//   const [containerHeight, setContainerHeight] = useState<number | null>(null);

//   const handleResize = () => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.clientWidth);
//       setContainerHeight(window.innerHeight);
//       // setContainerHeight(containerRef.current.clientHeight);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     if (containerRef.current) {
//       setContainerWidth(containerRef.current.clientWidth);
//       setContainerHeight(window.innerHeight);
//       // setContainerHeight(containerRef.current.clientHeight);
//     }
//   }, []);

//   return (
//     <Container ref={containerRef}>
//       <Canvas
//         // selectedTool={selectedTool}
//         containerWidth={containerWidth}
//         containerHeight={containerHeight}
//       />
//     </Container>
//   );
// }
