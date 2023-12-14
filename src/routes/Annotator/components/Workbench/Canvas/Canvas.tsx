import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { getCanvasImage } from 'helpers/ImagesHelpers';
import paper from 'paper';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  selectSAM,
  setSAMEmbeddingId,
  setSAMEmbeddingLoaded,
  setSAMEmbeddingLoading,
  setSAMModelLoaded,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import { Editor } from './Canvas.style';
import { onCanvasWheel } from './helpers/canvasHelper';
import useTools, { AnnotationTool } from './hooks/useTools';
// 브러쉬 툴, 지우개 툴 등 툴브
import { Helmet } from 'react-helmet-async';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import { brushCursor, eraserCursor } from './tools';

let canvasChildren: paper.Item[];

interface CanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

// TODO: paper init to another file?
export default function Canvas(props: CanvasProps) {
  const dispatch = useAppDispatch();
  const imageId = Number(useParams().imageId);
  const { selectedTool, categories, currentAnnotation, image } =
    useAppSelector(selectAnnotator);
  const { drawPaths } = useReloadAnnotator();
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
  const loadSAM = useCallback(
    async (modelType?: string) => {
      dispatch(setSAMModelLoading(true));
      try {
        const response = await SAMModel.loadModel(
          modelType ? modelType : 'vit_l',
        );
        if (response.status !== 200) throw new Error('Failed to load SAM');

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
    },
    [dispatch],
  );

  const embedImage = useCallback(
    async (imageId: number) => {
      if (!image) return;
      if (image.width >= 4096 || image.height >= 4096) {
        dispatch(setSAMEmbeddingId(null));
        dispatch(setSAMEmbeddingLoaded(false));
        alert(
          '이미지의 크기가 너무 큽니다. 4096 * 4096 이하의 이미지를 사용해주세요.',
        );
        return;
      }

      dispatch(setSAMEmbeddingLoading(true));

      try {
        // 이건 첫 embed 생성이다.
        // (0, 0)과 (image.width, image.height)를 보내는 이유는
        // embed image가 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같다
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
    },
    [dispatch, image],
  );

  const selectedToolInstances = useTools({
    selectedTool,
    canvasChildren,
    imageId,
    image,
  });

  // 선택된 툴이 바뀔 때마다 activate
  useEffect(() => {
    const selectedToolInstance = selectedToolInstances[selectedTool];
    selectedToolInstance?.activate();
  }, [selectedToolInstances, selectedTool]);

  // 캔버스 초기 설정 시, 캔버스 히스토리 초기리
  useEffect(() => {
    AnnotationTool.history.undo = [];
    AnnotationTool.history.redo = [];
  }, []);

  // 캔버스 초기 설정 useEffect (이미지 로드 후)
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (paper.project) paper.project.clear();
    paper.setup(canvas);
    paper.activate();

    canvasChildren = paper.project.activeLayer.children;

    canvas.onwheel = onCanvasWheel;
    canvas.onmouseleave = () => {
      if (brushCursor) brushCursor.remove();
      if (eraserCursor) eraserCursor.remove();
    };

    const { children } = paper.project.activeLayer;

    const imageUrl = getCanvasImage(imageId);
    const raster = new paper.Raster({
      source: imageUrl,
      onLoad: () => {
        raster.position = paper.view.center;

        children.forEach((child) => {
          if (child instanceof paper.CompoundPath)
            child.position = child.position.add(raster.bounds.topLeft);
        });
        // 이미지 로드 여부를 정해버림
        setIsImageLoaded(true);
      },
    });
    // 박스 쉐도우 추가
    raster.shadowColor = new paper.Color('rgba(0, 0, 0, 0.4)');
    raster.shadowBlur = 12;
    raster.shadowOffset = new paper.Point(3, 3);

    // @Issue: temporary fix
    // Annotator page: 왼쪽 사각 빈공간 #16
    setTimeout(() => {
      const tempPath = new paper.Path();
      tempPath.remove();
    });

    return () => {
      canvas.onwheel = null;
      canvas.onmouseleave = null;
    };
  }, [imageId, canvasRef]);

  useEffect(() => {
    // 데이터셋이 아직 없으면 마스크를 그리지 않는다.
    if (!categories) return;

    // 이미지가 아직 로드 되지 않았다면 마스크를 그리지 않는다.
    // 이유는 이미지가 로드 되기 전에 마스크를 그리면 기준 좌표가 0, 0이 되기 때문이다.
    if (!isImageLoaded) return;

    drawPaths(categories);
  }, [categories, isImageLoaded, drawPaths]);

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
  }, [selectedTool, SAMModelLoaded, embeddingId, imageId, embedImage, loadSAM]);

  // remove eraser cursor and brush cursor on tool change
  useEffect(() => {
    if (selectedTool !== Tool.Brush) {
      if (brushCursor) brushCursor.remove();
    }
    if (selectedTool !== Tool.Eraser) {
      if (eraserCursor) eraserCursor.remove();
    }
  }, [selectedTool]);

  const { containerRef } = props;
  useEffect(() => {
    if (!containerRef || !containerRef?.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    paper.view.viewSize = new paper.Size(width, height);
    paper.view.center = new paper.Point(width / 2, height / 2);
  }, [containerRef]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resizeCanvas = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (!canvas || !container) return;

        const { width, height } = container.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        paper.view.viewSize = new paper.Size(width, height);
      }, 75);
    };

    // 이거랑 밑에랑 같은 함수인데... 여기서 실행하면 안 되고 밑에서 실행해야 함
    // setTimeout interval 때문인가 싶기도 하고... 그냥 이렇게 해놓고 밑에서 실행하자
    // resize()
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, containerRef]);

  // 저기 위의 tempPath는 사진이 안 나오는 걸 방지하기 위해 임시로 만든 미봉책이고
  // 지금 여기 있는 건, 전체 캔버스 크기를 조정하는 미봉책이다.
  // 이게 없으면 캔버스 사이즈가 제대로 안 나옴 왜냐하면
  // 상위 HTML Element의 height:100%를 여기서 주는데 초반에 렌더링 될 시
  // height들이 작기 때문에 Canvas사이즈도 작아지고
  // 그걸 해결하기 위해 마운트 된 뒤에, 다시 한번 캔버스 사이즈를 조정해주는 것이다.

  // 근데 이거랑 위에랑 같은 함수인데 왜인지 이게 없으면 초반 렌더링이 제대로 안 되는 중...
  useEffect(() => {
    if (canvasRef.current === null || containerRef.current == null) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    setTimeout(() => {
      const { width, height } = container.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      paper.view.viewSize = new paper.Size(width, height);
    });
  }, [canvasRef, containerRef]);

  return (
    <>
      <Helmet
        style={[
          {
            cssText: `
            html, body, #root, #app, #main, #main > div {
                height: 100%;
                overflow: hidden;
            }
            #main {
              height: calc(100% - 64px);
            }
        `,
          },
        ]}
      />
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
    </>
  );
}
