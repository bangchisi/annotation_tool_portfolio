import paper from 'paper';
import { useEffect, useRef, useState } from 'react';
import { fetchImage, onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { Tool } from 'routes/Annotator/Annotator';
import { useTools } from './hooks/useTools';

interface CanvasProps {
  selectedTool: Tool;
  containerWidth: number | null;
  containerHeight: number | null;
}

// TODO: paper init to another file?
export default function Canvas({
  selectedTool,
  containerWidth,
  containerHeight,
}: CanvasProps) {
  // if (selectedTool == Tool.Select) {
  //   console.log('Go Select');
  // } else if (selectedTool == Tool.Polygon) {
  //   PolygonTool();
  // }
  const [initPoint, setInitPoint] = useState<paper.Point | null>(null);
  console.log('Canvas, initPoint ', initPoint);
  // const initPoint: paper.Point | null = null;
  let imgWidth: number | null = null;
  let imgHeight: number | null = null;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const img = new Image();
  // img.src = 'https://placehold.it/550x550';

  // 캔버스 초기 설정 useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // paper.install(window);
      paper.setup(canvas);
      // FIX: (700, 700) into flexible value
      if (containerWidth && containerHeight) {
        paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
        paper.view.center = new paper.Point(
          containerWidth / 2,
          containerHeight / 2,
        );
      }
      paper.activate();

      const raster = new paper.Raster();

      fetchImage({ datasetId: -1, imageId: -1 }).then((response) => {
        if (response) {
          const tempCtx = document.createElement('canvas').getContext('2d');
          const img = new Image();
          img.src = response.src;
          img.onload = () => {
            raster.source = response.src;
            raster.position = paper.view.center;
            imgWidth = raster.image.width;
            imgHeight = raster.image.height;
            console.log(imgWidth, imgHeight);
            // raster.sendToBack();

            if (tempCtx) {
              tempCtx.canvas.width = img.width;
              tempCtx.canvas.height = img.height;
              tempCtx.drawImage(raster.image, 0, 0);
            }
          };
        }
      });

      // 줌, 스크롤은 항상 적용
      canvas.onwheel = onCanvasWheel;

      return () => {
        raster.remove();
      };
    }
  }, []);

  const { onMouseMove, onMouseDown, onMouseDrag } = useTools({
    initPoint,
    selectedTool,
    onChangePoint: setInitPoint,
    containerWidth,
    containerHeight,
    // state를 바꾸려면, 여기에 props로 전달해줄 함수가 더 생길 것임
  });

  useEffect(() => {
    paper.view.onMouseDown = onMouseDown;
    paper.view.onMouseMove = onMouseMove;
    paper.view.onMouseDrag = onMouseDrag;

    return () => {
      paper.view.onMouseDown = null;
      paper.view.onMouseMove = null;
      paper.view.onMouseDrag = null;
    };
  }, [selectedTool, onMouseMove, onMouseDown, onMouseDrag]);

  // window 리사이즈 시 useEffect
  useEffect(() => {
    if (containerWidth && containerHeight) {
      paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
    }
  }, [containerWidth, containerHeight]);

  return <Editor ref={canvasRef} id="canvas"></Editor>;
}
