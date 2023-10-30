import paper from 'paper';
import { useEffect, useRef, useState } from 'react';
import { fetchImage, onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { useTools } from './hooks/useTools';
import { useAppSelector } from 'App.hooks';
import { paths } from 'routes/Annotator/Annotator';
import { stat } from 'fs';
import { getImagePath } from 'helpers/ImagesHelpers';
import { useParams } from 'react-router-dom';

interface CanvasProps {
  // selectedTool: Tool;
  containerWidth: number | null;
  containerHeight: number | null;
}

// TODO: paper init to another file?
export default function Canvas({
  // selectedTool,
  containerWidth,
  containerHeight,
}: CanvasProps) {
  // console.log('rendering Canvas.tsx');
  const datasetId = useAppSelector((state) => state.annotator.datasetId);
  const imageId = Number(useParams().imageId);
  const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const image = useAppSelector((state) => state.annotator.image);

  const [initPoint, setInitPoint] = useState<paper.Point | null>(null);
  // const { width: imageWidth, height: imageHeight } = image;
  let imgWidth: number | null = null;
  let imgHeight: number | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      const tempCtx = document.createElement('canvas').getContext('2d');
      const img = new Image();
      const imgPath = getImagePath(imageId, image?.width);
      img.src = imgPath;
      img.onload = () => {
        raster.source = imgPath;
        raster.position = paper.view.center;
        imgWidth = raster.image.width;
        imgHeight = raster.image.height;

        if (tempCtx) {
          tempCtx.canvas.width = img.width;
          tempCtx.canvas.height = img.height;
          tempCtx.drawImage(raster.image, 0, 0);
        }
      };

      // 줌, 스크롤은 항상 적용
      canvas.onwheel = onCanvasWheel;

      return () => {
        raster.remove();
      };
    }
  }, []);

  // 기존 그림 불러오기
  // useEffect(() => {
  //   console.dir(paper.project.activeLayer.children);
  // }, []);

  const { onMouseMove, onMouseDown, onMouseUp, onMouseDrag } = useTools({
    initPoint,
    selectedTool,
    onChangePoint: setInitPoint,
    currentAnnotation,
    currentCategory,
    // containerWidth,
    // containerHeight,
    // state를 바꾸려면, 여기에 props로 전달해줄 함수가 더 생길 것임
  });

  useEffect(() => {
    paper.view.onMouseDown = onMouseDown;
    paper.view.onMouseUp = onMouseUp;
    paper.view.onMouseMove = onMouseMove;
    paper.view.onMouseDrag = onMouseDrag;

    return () => {
      paper.view.onMouseDown = null;
      paper.view.onMouseUp = null;
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

  return (
    <Editor ref={canvasRef} id="canvas" selectedTool={selectedTool}></Editor>
  );
}
