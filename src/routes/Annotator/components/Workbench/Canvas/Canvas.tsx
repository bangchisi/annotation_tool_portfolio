import paper from 'paper';
import { useEffect, useRef, useState } from 'react';
import { fetchImage, onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { Tool } from 'routes/Annotator/Annotator';

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

      // canvas.onwheel = onCanvasWheel;

      return () => {
        raster.remove();
      };
    }
  }, []);

  // 툴 변경 시 useEffect
  useEffect(() => {
    if (selectedTool == Tool.Select) {
      console.log('Select Tool ON');
      // SelectTool(initPoint);
    } else if (selectedTool == Tool.Brush) {
      console.log('Go Brush');
      // BrushTool();
    }

    // selectedTool이 변경되기 전에 mouse event 비활성화
    return () => {
      paper.view.onMouseDown = null;
      paper.view.onMouseMove = null;
      paper.view.onMouseDrag = null;
    };
  }, [selectedTool]);

  // window 리사이즈 시 useEffect
  useEffect(() => {
    if (containerWidth && containerHeight) {
      paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
    }
  }, [containerWidth, containerHeight]);

  return <Editor ref={canvasRef} id="canvas"></Editor>;
}
