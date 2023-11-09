import paper from 'paper';
import { Fragment, useEffect, useRef, useState } from 'react';
import { getViewBounds, onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { useTools } from './hooks/useTools';
import { useAppSelector, useAppDispatch } from 'App.hooks';
import { getImagePath } from 'helpers/ImagesHelpers';
import { useParams } from 'react-router-dom';
import PathStore from 'routes/Annotator/utils/PathStore';
import { Tool } from 'routes/Annotator/Annotator';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import SAMModel from 'routes/Annotator/models/SAM.model';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { setIsSAMLoaded } from 'routes/Annotator/slices/annotatorSlice';

interface CanvasProps {
  // selectedTool: Tool;
  containerWidth: number | null;
  containerHeight: number | null;
}

export let canvasData: PathStore;
let canvasChildren: paper.Item[];

// TODO: paper init to another file?
export default function Canvas({
  // selectedTool,
  containerWidth,
  containerHeight,
}: CanvasProps) {
  // console.log('rendering Canvas.tsx');
  const dispatch = useAppDispatch();
  const [isSAMLoading, setIsSAMLoading] = useState(false);
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
  const isSAMLoaded = useAppSelector((state) => state.annotator.isSAMLoaded);

  const [initPoint, setInitPoint] = useState<paper.Point | null>(null);
  // const { width: imageWidth, height: imageHeight } = image;
  let imgWidth: number | null = null;
  let imgHeight: number | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SAM model 로드
  async function loadSAM(modelType?: string) {
    setIsSAMLoading(true);
    try {
      const response = await SAMModel.loadModel(
        modelType ? modelType : 'vit_h',
      );
      console.log('response');
      console.dir(response);
      dispatch(setIsSAMLoaded(true));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to load SAM');
      // TODO: prompt를 띄워 다시 로딩하시겠습니까? yes면 다시 load 트라이
      dispatch(setIsSAMLoaded(false));
      alert(
        'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
      );
    } finally {
      setIsSAMLoading(false);
    }
  }

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
      canvasData = new PathStore(paper.project.activeLayer.children);
      canvasChildren = paper.project.activeLayer.children;

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
    canvasChildren,
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

  // SAM 로딩 했는지 검사
  useEffect(() => {
    if (selectedTool === Tool.SAM) {
      if (isSAMLoaded) return;
      loadSAM();
    }
  }, [selectedTool]);

  // window 리사이즈 시 useEffect
  useEffect(() => {
    if (containerWidth && containerHeight) {
      paper.view.viewSize = new paper.Size(containerWidth, containerHeight);
    }
  }, [containerWidth, containerHeight]);

  return (
    <Fragment>
      {isSAMLoading && (
        <LoadingSpinner message="SAM을 불러오는 중입니다. 조금만 기다려주세요." />
      )}
      <Editor ref={canvasRef} id="canvas" selectedTool={selectedTool}></Editor>
    </Fragment>
  );
}
