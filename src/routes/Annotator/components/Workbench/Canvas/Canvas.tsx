import paper from 'paper';
import { Fragment, useEffect, useRef, useState } from 'react';
import { onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { useTools } from './hooks/useTools';
import { useAppSelector, useAppDispatch } from 'App.hooks';
import { getCanvasImage, getImagePath } from 'helpers/ImagesHelpers';
import { useParams } from 'react-router-dom';
import PathStore from 'routes/Annotator/utils/PathStore';
import { Tool } from 'routes/Annotator/Annotator';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import SAMModel from 'routes/Annotator/models/SAM.model';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { CategoriesType } from 'routes/Annotator/Annotator.types';
import {
  setSAMEmbeddingId,
  setSAMEmbeddingLoading,
  setSAMModelLoaded,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';

export let canvasData: PathStore;
let canvasChildren: paper.Item[];

interface CanvasProps {
  drawPaths: (categories: CategoriesType) => void;
  width?: number;
  height?: number;
}

// TODO: paper init to another file?
export default function Canvas(props: CanvasProps) {
  const { drawPaths, width, height } = props;
  // console.log('rendering Canvas.tsx');
  const dispatch = useAppDispatch();
  const datasetId = useAppSelector((state) => state.annotator.datasetId);
  const imageId = Number(useParams().imageId);
  const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const image = useAppSelector((state) => state.annotator.image);

  const [initPoint, setInitPoint] = useState<paper.Point | null>(null);
  // const { width: imageWidth, height: imageHeight } = image;
  const imgWidth: number | null = null;
  const imgHeight: number | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SAM 관련 state
  const SAMModelLoaded = useAppSelector((state) => state.sam.SAM.modelLoaded);
  const isSAMModelLoading = useAppSelector(
    (state) => state.sam.SAM.modelLoading,
  );
  const isEmbeddingLoading = useAppSelector(
    (state) => state.sam.SAM.embeddingLoading,
  );
  const embeddingId = useAppSelector((state) => state.sam.SAM.embeddingId);

  // SAM model 로드
  async function loadSAM(modelType?: string) {
    dispatch(setSAMModelLoading(true));
    try {
      const response = await SAMModel.loadModel(
        modelType ? modelType : 'vit_l',
      );
      console.log('response');
      console.dir(response);
      dispatch(setSAMModelLoaded(true));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to load SAM');
      // TODO: prompt를 띄워 다시 로딩하시겠습니까? yes면 다시 load 트라이
      dispatch(setSAMModelLoaded(false));

      alert(
        'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
      );
    } finally {
      dispatch(setSAMModelLoading(false));
    }
  }

  async function embedImage(imageId: number) {
    // embed image, 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같다
    if (!image) return;
    dispatch(setSAMEmbeddingLoading(true));
    try {
      const response = await SAMModel.embedImage(
        imageId,
        new paper.Point(0, 0),
        new paper.Point(image.width, image.height),
      );
      dispatch(setSAMEmbeddingId(imageId));
      console.log('image embedding response');
      console.log(response);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get image embedding');
      dispatch(setSAMEmbeddingId(null));
    } finally {
      dispatch(setSAMEmbeddingLoading(false));
    }
  }

  // 캔버스 초기 설정 useEffect (이미지 로드 후)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      paper.setup(canvas);
      paper.activate();

      canvasData = new PathStore(paper.project.activeLayer.children);
      canvasChildren = paper.project.activeLayer.children;

      canvas.onwheel = onCanvasWheel;

      const raster = new paper.Raster({
        onLoad: function () {
          // 이미지가 로드된 후에 중앙으로 이동
          raster.position = paper.view.center;
        },
      });
      const imagePath = getCanvasImage(imageId);
      raster.source = imagePath;
    }
  }, []);

  // 캔버스 초기 설정 useEffect
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     // paper.install(window);
  //     paper.setup(canvas);
  //     paper.activate();

  //     canvasData = new PathStore(paper.project.activeLayer.children);
  //     canvasChildren = paper.project.activeLayer.children;

  //     // 줌, 스크롤은 항상 적용
  //     canvas.onwheel = onCanvasWheel;

  //     const raster = new paper.Raster();
  //     const imagePath = getCanvasImage(imageId);
  //     raster.source = imagePath;
  //     raster.position = paper.view.center;
  //   }
  // }, []);

  useEffect(() => {
    if (width && height) {
      paper.view.viewSize = new paper.Size(width, height);
      paper.view.center = new paper.Point(width / 2, height / 2);
    }
  }, [width, height]);

  useEffect(() => {
    if (!categories) return;
    console.log('drawPath');
    drawPaths(categories);

    return () => {
      console.log('%ccleanup', 'color:red');
      paper.project.activeLayer.children.find((child) => {
        console.log('child');
        console.dir(child);
        // if (child instanceof paper.CompoundPath) {
        //   child.remove();
        // }
      });
    };
  }, [categories]);

  const { onMouseMove, onMouseDown, onMouseUp, onMouseDrag } = useTools({
    initPoint,
    selectedTool,
    onChangePoint: setInitPoint,
    canvasChildren,
    currentAnnotation,
    currentCategory,
    SAMModelLoaded,
    embeddingId,
    // setIsEverythingLoading,
    // containerWidth,
    // containerHeight,
    // state를 바꾸려면, 여기에 props로 전달해줄 함수가 더 생길 것임
    imageId,
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
      // SAM은 로드 했지만 다른 이미지 embedding을 생성해야 할때
      if (SAMModelLoaded) {
        if (embeddingId === imageId) return;
        embedImage(imageId);
        return;
      }

      // SAM 로드 안했을때.
      loadSAM().then(() => {
        if (embeddingId === imageId) return;
        embedImage(imageId);
      });
    }
  }, [selectedTool]);

  return (
    <Fragment>
      {isSAMModelLoading && (
        <LoadingSpinner message="SAM을 불러오는 중입니다. 조금만 기다려주세요." />
      )}
      {isEmbeddingLoading && (
        <LoadingSpinner message="image embedding을 불러오는 중입니다. 조금만 기다려주세요." />
      )}
      <Editor ref={canvasRef} id="canvas" selectedTool={selectedTool}></Editor>
    </Fragment>
  );
}
