import paper from 'paper';
import { useEffect, useRef } from 'react';
import {
  drawAnnotation,
  fetchImage,
  onCanvasWheel,
} from './helpers/canvasHelper';
import { Editor } from './Canvas.style';

interface CanvasProps {
  containerWidth: number | null;
  containerHeight: number | null;
}

// TODO: paper init to another file?
export default function Canvas({
  containerWidth,
  containerHeight,
}: CanvasProps) {
  let initPoint: paper.Point | null = null;
  let imgWidth: number | null = null;
  let imgHeight: number | null = null;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const img = new Image();
  // img.src = 'https://placehold.it/550x550';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
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
            // raster.sendToBack();

            if (tempCtx) {
              tempCtx.canvas.width = img.width;
              tempCtx.canvas.height = img.height;
              tempCtx.drawImage(raster.image, 0, 0);
            }
          };
        }
      });

      paper.view.onMouseDown = (event: paper.MouseEvent) => {
        initPoint = event.point;
        if (containerWidth && containerHeight && imgWidth && imgHeight) {
          console.log('trying drawAnnotation()');
          drawAnnotation(containerWidth, containerHeight, imgWidth, imgHeight);
          console.log(
            event.point.subtract(
              new paper.Point(containerWidth / 2, containerHeight / 2),
            ),
          );
        }
      };

      paper.view.onMouseMove = (event: paper.MouseEvent) => {
        initPoint = event.point;
      };

      paper.view.onMouseDrag = (event: paper.MouseEvent) => {
        if (initPoint) {
          const delta_x: number | null = initPoint.x - event.point.x;
          const delta_y: number | null = initPoint.y - event.point.y;
          const center_delta = new paper.Point(delta_x, delta_y);
          const new_center = paper.view.center.add(center_delta);
          paper.view.center = new_center;
          console.log(paper.view.center);
        }
      };

      canvas.onwheel = onCanvasWheel;

      return () => {
        raster.remove();
        paper.view.onMouseDown = null;
        paper.view.onMouseMove = null;
        paper.view.onMouseDrag = null;
      };
    }
  }, []);

  useEffect(() => {
    if (containerWidth && containerHeight) {
      paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
    }
  }, [containerWidth, containerHeight]);

  return <Editor ref={canvasRef} id="canvas"></Editor>;
}
