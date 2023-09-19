import paper from 'paper';
import { useEffect, useRef } from 'react';
import {
  drawAnnotation,
  fetchImage,
  onCanvasWheel,
} from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { Tool } from 'routes/Annotator/Annotator';
import { PaperClassKey } from '@mui/material';

interface CanvasProps {
  selectedTool: Tool;
  containerWidth: number | null;
  containerHeight: number | null;
}

const SelectTool = (
  initPoint: any,
  containerWidth: any,
  containerHeight: any,
  imgWidth: any,
  imgHeight: any,
) => {
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
    console.log('onMouseDrag', event);
    if (initPoint) {
      const delta_x: number | null = initPoint.x - event.point.x;
      const delta_y: number | null = initPoint.y - event.point.y;
      const center_delta = new paper.Point(delta_x, delta_y);
      const new_center = paper.view.center.add(center_delta);
      paper.view.center = new_center;
      console.log(paper.view.center);
    }
  };
};

const PolygonTool = () => {
  let myPath: any = null;
  const strokeColor = new paper.Color('black');

  let brush_path: any = null;
  const createBrush = (center? : any) => {
    center = center || new paper.Point(0, 0);
    brush_path = new paper.Path.Circle({
      center: center,
      strokeColor: strokeColor,
      strokeWidth: 30,
      radius: 10,
    });
  };

  const createSelection = () => {
    // do nothing
  };
  

  paper.view.onMouseDown = (event: paper.ToolEvent) => {
    console.log('Polygon Mouse Down', event);
    myPath = new paper.Path();
    myPath.strokeColor = new paper.Color('black');
  };

  paper.view.onMouseDrag = (event: paper.ToolEvent) => {
    console.log('Polygon Mouse Drag', event);
    const circle = new paper.Path.Circle({
      center: event.middlePoint,
      radius: event.delta.length / 2,
    });
    circle.fillColor = new paper.Color('white');
  };

  paper.view.onMouseUp = (event: paper.ToolEvent) => {
    console.log('Polygon Mouse Up', event);
    const myCircle = new paper.Path.Circle({
      center: event.point,
      radius: 10,
    });
    myCircle.strokeColor = new paper.Color('black');
    myCircle.fillColor = new paper.Color('white');
  };
};

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

  const initPoint: paper.Point | null = null;
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

      if (selectedTool == Tool.Select) {
        SelectTool(
          initPoint,
          containerWidth,
          containerHeight,
          imgWidth,
          imgHeight,
        );
      } else if (selectedTool == Tool.Polygon) {
        console.log('Go Polygon');
        PolygonTool();
      }

      canvas.onwheel = onCanvasWheel;

      return () => {
        raster.remove();
        paper.view.onMouseDown = null;
        paper.view.onMouseMove = null;
        paper.view.onMouseDrag = null;
      };
    }
  }, [selectedTool]);

  useEffect(() => {
    if (containerWidth && containerHeight) {
      paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
    }
  }, [containerWidth, containerHeight]);

  return <Editor ref={canvasRef} id="canvas"></Editor>;
}
