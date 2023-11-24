import paper from 'paper';
import { Fragment, useEffect, useRef, useLayoutEffect } from 'react';
import { onCanvasWheel } from './helpers/canvasHelper';
import { Editor } from './Canvas.style';
import { useAppSelector, useAppDispatch } from 'App.hooks';
import { getCanvasImage } from 'helpers/ImagesHelpers';
import { useParams } from 'react-router-dom';
import { Tool } from 'routes/Annotator/Annotator';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import SAMModel from 'routes/Annotator/models/SAM.model';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { CategoriesType } from 'routes/Annotator/Annotator.types';
import {
  selectSAM,
  setSAMEmbeddingId,
  setSAMEmbeddingLoading,
  setSAMModelLoaded,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';
import useTools from './hooks/useTools';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
// 브러쉬 툴, 지우개 툴 등 툴브
import { eraserCursor, brushCursor } from './tools';

let canvasChildren: paper.Item[];

interface CanvasProps {
  drawPaths: (categories: CategoriesType) => void;
  width?: number;
  height?: number;
}

// TODO: paper init to another file?
export default function Canvas(props: CanvasProps) {
  const { drawPaths, width, height } = props;
  const dispatch = useAppDispatch();
  const imageId = Number(useParams().imageId);
  const { selectedTool, categories, currentAnnotation, image } =
    useAppSelector(selectAnnotator);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SAM 관련 state
  const {
    embeddingId,
    clickLoading,
    modelLoaded: SAMModelLoaded,
    modelLoading: isSAMModelLoading,
    embeddingLoading: isEmbeddingLoading,
    everythingLoading: isSAMEverythingLoading,
  } = useAppSelector(selectSAM);

  // SAM model 로드
  async function loadSAM(modelType?: string) {
    dispatch(setSAMModelLoading(true));
    try {
      const response = await SAMModel.loadModel(
        modelType ? modelType : 'vit_l',
      );
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
      if (response.status !== 200)
        throw new Error('Failed to get image embedding');
      dispatch(setSAMEmbeddingId(imageId));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get image embedding');
      dispatch(setSAMEmbeddingId(null));
    } finally {
      dispatch(setSAMEmbeddingLoading(false));
    }
  }

  // 캔버스 초기 설정 useEffect (이미지 로드 후)
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);
    paper.activate();

    canvasChildren = paper.project.activeLayer.children;

    canvas.onwheel = onCanvasWheel;
    canvas.onmouseleave = () => {
      if (brushCursor) brushCursor.remove();
      if (eraserCursor) eraserCursor.remove();
    };

    const raster = new paper.Raster({
      onLoad: function () {
        // 이미지가 로드된 후에 중앙으로 이동
        raster.position = paper.view.center;
      },
    });
    raster.source = getCanvasImage(imageId);

    return () => {
      canvas.onwheel = null;
      canvas.onmouseleave = null;
    };
  }, []);

  useEffect(() => {
    if (width && height) {
      paper.view.viewSize = new paper.Size(width, height);
      paper.view.center = new paper.Point(width / 2, height / 2);
    }
  }, [width, height]);

  useEffect(() => {
    if (!categories) return;
    drawPaths(categories);
  }, [categories]);

  const selectedToolsHandlers = useTools({
    selectedTool,
    canvasChildren,
    imageId,
    image,
  });
  const { onMouseMove, onMouseDown, onMouseUp, onMouseDrag } =
    selectedToolsHandlers;

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
  }, [selectedTool, selectedToolsHandlers, currentAnnotation]);

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
      {isSAMEverythingLoading && (
        <LoadingSpinner message="SAM Everything 생성중입니다..." />
      )}
      {clickLoading && <LoadingSpinner message="SAM Click 생성중입니다..." />}
      <Editor ref={canvasRef} id="canvas" selectedTool={selectedTool}></Editor>
    </Fragment>
  );
}
