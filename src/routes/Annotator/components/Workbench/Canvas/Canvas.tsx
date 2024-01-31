import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import { getCanvasImage } from 'helpers/ImagesHelpers';
import paper from 'paper';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
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
import useTools, { AnnotationTool } from './hooks/useTools';
// 브러쉬 툴, 지우개 툴 등 툴브
import { Helmet } from 'react-helmet-async';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';
import { initializePaper } from 'utils';
import { useTypedSWRMutation } from 'hooks';
import useSWRMutation from 'swr/mutation';

// 캔버스 사이즈 조정
const adjustCanvasSize = (
  canvas: HTMLCanvasElement | null, // 캔버스
  container: HTMLDivElement | null, // 캔버스 컨테이너
) => {
  // 캔버스가 없거나, 컨테이너가 없으면 아무것도 안 함
  if (!canvas || !container) return;

  const { width, height } = container.getBoundingClientRect(); // 컨테이너의 크기를 가져옴

  canvas.width = width; // 캔버스의 크기를 컨테이너의 크기로 조정
  canvas.height = height; // 캔버스의 크기를 컨테이너의 크기로 조정

  paper.view.viewSize = new paper.Size(width, height); // 캔버스의 뷰 사이즈를 컨테이너의 크기로 조정

  return {
    width,
    height,
  };
};

// 캔버스 props
interface CanvasProps {
  containerRef: React.RefObject<HTMLDivElement>; // 캔버스 컨테이너
}

// 캔버스 컴포넌트
export default function Canvas(props: CanvasProps) {
  const dispatch = useAppDispatch();
  const imageId = Number(useParams().imageId); // 이미지 아이디
  const { selectedTool, categories, image } = useAppSelector(selectAnnotator); // 선택된 툴, 카테고리 목록 객체, 이미지 객체
  const { drawPaths } = useReloadAnnotator(); // 캔버스에 mask를 그리는 함수
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 ref

  // SAM 관련 state
  const {
    embeddingId, // 생성된 이미지 임베딩 id
    clickLoading, // 클릭 모드 로딩 여부
    modelLoaded: SAMModelLoaded, // SAM 모델 로드 여부
    modelLoading: isSAMModelLoading, // SAM 모델 로딩 여부
    embeddingLoading: isEmbeddingLoading, // 이미지 임베딩 로딩 여부
    everythingLoading: isSAMEverythingLoading, // SAM Everything 로딩 여부
  } = useAppSelector(selectSAM);

  // 이미지 임베딩 요청 fetcher
  const embedFetcher = async (
    url: string,
    { arg }: { arg: { topLeft: paper.Point; bottomRight: paper.Point } },
  ) => {
    return typedAxios('post', '/sam/embed', {
      image_id: image?.imageId,
      image_left_top_coord: [
        Math.floor(arg.topLeft.x),
        Math.floor(arg.topLeft.y),
      ],
      image_right_bottom_coord: [
        Math.floor(arg.bottomRight.x),
        Math.floor(arg.bottomRight.y),
      ],
    });
  };

  // 이미지 임베딩 요청 mutation
  const { trigger: embedTrigger } = useSWRMutation(
    '/sam/embed/canvas',
    embedFetcher,
  );

  // SAM 모델 로드 요청 mutation
  const { trigger: loadModel } = useTypedSWRMutation({
    method: 'get',
    endpoint: '/sam/load/vit_h',
  });

  // SAM model 로드 함수. 모델 선택할 때와 다르게 초기 로드기 때문에 기본 선택된 모델인 vit_h를 로드합니다.
  const loadSAM = useCallback(async () => {
    dispatch(setSAMModelLoading(true));
    try {
      await loadModel();

      dispatch(setSAMModelLoaded(true));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to load SAM');
      dispatch(setSAMModelLoaded(false));

      alert(
        'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
      );
    } finally {
      dispatch(setSAMModelLoading(false));
    }
  }, [loadModel, dispatch]);

  // 이미지 임베딩 불러오는 함수. 이미지 크기가 4096*4096보다 크면 요청하지 않습니다.
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
        // 이건 첫 embed 생성입니다.
        // (0, 0)과 (image.width, image.height)를 인자로 보내는 이유는
        // 첫 embedding 생성은 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같기 때문입니다.
        await embedTrigger({
          topLeft: new paper.Point(0, 0),
          bottomRight: new paper.Point(image.width, image.height),
        });
        dispatch(setSAMEmbeddingId(imageId));
      } catch (error) {
        axiosErrorHandler(error, 'Failed to get image embedding');
        dispatch(setSAMEmbeddingId(null));
      } finally {
        dispatch(setSAMEmbeddingLoading(false));
      }
    },
    [dispatch, image, embedTrigger],
  );

  // 캔버스 휠 이벤트
  const onCanvasWheel = useCallback((event: WheelEvent): void => {
    event.preventDefault();
    const dragAmount = 30; // 드래그 양. ctrl, shift 키를 누르면 이만큼 이동합니다.

    if (event.ctrlKey) {
      // ctrl 키를 누르면 세로로 이동합니다.
      if (event.deltaY < 0) {
        paper.view.center = paper.view.center.subtract(
          new paper.Point(0, dragAmount),
        );
      } else {
        paper.view.center = paper.view.center.add(
          new paper.Point(0, dragAmount),
        );
      }
    } else if (event.shiftKey) {
      // shift 키를 누르면 가로로 이동합니다.
      if (event.deltaY < 0) {
        paper.view.center = paper.view.center.subtract(
          new paper.Point(dragAmount, 0),
        );
      } else {
        paper.view.center = paper.view.center.add(
          new paper.Point(dragAmount, 0),
        );
      }
    } else {
      // 아무 키도 누르지 않으면 확대/축소합니다.
      if (event.deltaY < 0) {
        paper.view.zoom += 0.1;
      } else if (paper.view.zoom > 0.2 && event.deltaY > 0) {
        paper.view.zoom -= 0.1;
      }
    }
  }, []);

  // 툴 초기화
  useTools();

  // 캔버스 초기 설정 시, 캔버스 히스토리 초기리
  useEffect(() => {
    AnnotationTool.history.undo = []; // 되돌리기 히스토리 초기화
    AnnotationTool.history.redo = []; // 다시하기 히스토리 초기화
  }, []);

  // 캔버스 초기 설정 useEffect (이미지 로드 후)
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 캔버스 초기화
    initializePaper(canvas);

    // 캔버스 휠 이벤트 등록
    canvas.onwheel = onCanvasWheel;

    const { children } = paper.project.activeLayer; // 캔버스의 요소들을 불러오기 위해 activeLayer의 children을 가져옴

    const imageUrl = getCanvasImage(imageId); // 이미지 url 가져오기
    const raster = new paper.Raster({
      source: imageUrl,
      onLoad: () => {
        raster.position = paper.view.center;

        children.forEach((child) => {
          if (child instanceof paper.CompoundPath)
            // 마스크를 그린 경우, 마스크의 좌표를 이미지의 좌표만큼 이동. 이렇게 해야 이미지 위에 마스크가 그려짐.
            child.position = child.position.add(raster.bounds.topLeft);
        });
        // 이미지 로드 여부를 정해버림
        setIsImageLoaded(true);
      },
    }); // 이미지 객체인 Raster 생성. source에 이미지 url을 넣어줌. onLoad는 이미지가 로드되면 실행됨.
    // 박스 쉐도우 추가
    raster.shadowColor = new paper.Color('rgba(0, 0, 0, 0.4)');
    raster.shadowBlur = 12;
    raster.shadowOffset = new paper.Point(3, 3);
    // onCanvasWheel dependency is added. remove if it causes problem
  }, [imageId, canvasRef, onCanvasWheel]);

  useEffect(() => {
    // 데이터셋이 아직 없으면 마스크를 그리지 않는다.
    if (!categories) return;

    // 이미지가 아직 로드 되지 않았다면 마스크를 그리지 않는다.
    // 이유는 이미지가 로드 되기 전에 마스크를 그리면 기준 좌표가 0, 0이 되기 때문이다.
    if (!isImageLoaded) return;

    // mask를 그림.
    drawPaths(categories);

    AnnotationTool.initializeHistory();
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

      // SAM 로드 안했을때. 모델 로드 후 이미지 임베딩 생성
      loadSAM().then(() => {
        if (embeddingId === imageId) return;
        embedImage(imageId);
      });
    }
  }, [selectedTool, SAMModelLoaded, embeddingId, imageId, embedImage, loadSAM]);

  const { containerRef } = props;

  // 캔버스 사이즈 조정
  useEffect(() => {
    const { width, height } = adjustCanvasSize(
      canvasRef.current,
      containerRef.current,
    ) || {
      width: 0,
      height: 0,
    };
    paper.view.center = new paper.Point(width / 2, height / 2);
  }, [containerRef]);

  // 캔버스 사이즈 조정. 리사이즈 이벤트 발생 시, debounce를 이용해 캔버스 사이즈 조정
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resizeCanvas = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        adjustCanvasSize(canvas, container);
      }, 75);
    };

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

  // 해당 useEffect가 없으면 초기 렌더링에 문제가 생기는데 이유를 파악하지 못함.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    setTimeout(() => {
      adjustCanvasSize(canvas, container);
    });
  }, [canvasRef, containerRef]);

  // width, height for zoom
  const { width, height } = useMemo(() => {
    return containerRef.current?.getBoundingClientRect() || ({} as DOMRect);
  }, [containerRef]);
  useEffect(() => {
    paper.view.viewSize = new paper.Size(width, height);
  }, [width, height]);

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
