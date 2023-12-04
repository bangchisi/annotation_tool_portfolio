import paper from 'paper';

import { useRef, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { ImageType } from 'routes/Annotator/Annotator.types';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  setSAMClickLoading,
  setSAMEmbeddingId,
  setSAMEmbeddingLoaded,
  setSAMEmbeddingLoading,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';

export let tempRect: paper.Path.Rectangle;

const useSAMTool = () => {
  const coords = useRef<[number, number][]>([]);
  const labels = useRef<number[]>([]);

  const dispatch = useAppDispatch();
  const { selectedTool, image, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  useEffect(() => {
    coords.current = [];
    labels.current = [];
  }, [selectedTool, currentAnnotation]);

  const onMouseDown = (event: paper.MouseEvent) => {
    event.preventDefault();
    if (!image || !currentCategory || !currentAnnotation) return;

    const viewBounds = paper.view.bounds;
    const raster = paper.project.activeLayer.children.find(
      (child) => child instanceof paper.Raster,
    ) as paper.Raster;
    if (!raster) return;
    const rasterBounds = raster.bounds;
    const { x, y } = rasterBounds.topLeft;

    const { topLeft, bottomRight } = getRegion(viewBounds, rasterBounds);

    const [calculatedTopLeft, calculatedBottomRight] = getConvertedCoordinate(
      topLeft,
      bottomRight,
      raster,
    );

    // TODO: click mode 구현

    const clickMode = (event as any).event.button === 0 ? 1 : 0;
    const [clickedX, clickedY] = [
      (Math.round(event.point.x - x) * 100) / 100,
      (Math.round(event.point.y - y) * 100) / 100,
    ];

    // clicked x와 y가 0보다 작거나 이미지 크기보다 크면 return
    if (
      clickedX < 0 ||
      clickedY < 0 ||
      clickedX > image.width ||
      clickedY > image.height
    )
      return;

    labels.current = [...labels.current, clickMode];
    coords.current = [...coords.current, [clickedX, clickedY]];

    embedImage(image, calculatedTopLeft, calculatedBottomRight).then(
      (result) => {
        if (result instanceof Error) return;
        click(image.imageId, calculatedTopLeft, calculatedBottomRight, [x, y]);

        // draw SAM Region
        if (tempRect) tempRect.remove();

        tempRect = new paper.Path.Rectangle({
          from: topLeft,
          to: bottomRight,
          strokeColor: new paper.Color('red'),
          strokeWidth: 5,
          guide: true,
        });
      },
    );
  };

  const onMouseUp = (event: paper.MouseEvent) => {
    // up
  };

  const onMouseMove = (event: paper.MouseEvent) => {
    // move
  };

  const onMouseDrag = (event: paper.MouseEvent) => {
    // drag
  };

  const onMouseLeave = (event: paper.MouseEvent) => {
    // leave
  };

  const click = async (
    imageId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
    correction: number[],
  ) => {
    if (!image) return;

    dispatch(setSAMClickLoading(true));
    try {
      const response = await SAMModel.click(
        imageId,
        coords.current,
        labels.current,
        topLeft,
        bottomRight,
      );
      const segmentation = response.data.segmentation;
      setChildrenWithSegmentation(segmentation, correction);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to SAM click');
    } finally {
      dispatch(setSAMClickLoading(false));
    }
  };

  const setChildrenWithSegmentation = (
    segmentation: number[][][],
    correction: number[],
  ) => {
    const { children } = paper.project.activeLayer;
    const compound = children.find(
      (child) =>
        child.data.annotationId === currentAnnotation?.annotationId &&
        child.data.categoryId === currentCategory?.categoryId,
    ) as paper.CompoundPath;

    compound.removeChildren();
    const correctedSegmentation = segmentation.map((path) => {
      return path.map((point) => {
        return [point[0] + correction[0], point[1] + correction[1]];
      });
    });

    compound.addChildren(
      correctedSegmentation.map((path) => {
        const correctedPath = new paper.Path(path);
        correctedPath.closed = true;
        return correctedPath;
      }),
    );
  };

  // view.bounds와 raster.bounds의 교차점을 구함
  function getRegion(
    viewBounds: paper.Rectangle,
    rasterBounds: paper.Rectangle,
  ) {
    const { topLeft: viewTopLeft, bottomRight: viewBottomRight } = viewBounds;
    const { topLeft: rasterTopLeft, bottomRight: rasterBottomRight } =
      rasterBounds;

    const calculatedTopLeft = new paper.Point(
      viewTopLeft.x < rasterTopLeft.x ? rasterTopLeft.x : viewTopLeft.x,
      viewTopLeft.y < rasterTopLeft.y ? rasterTopLeft.y : viewTopLeft.y,
    );

    const calculatedBottomRight = new paper.Point(
      viewBottomRight.x > rasterBottomRight.x
        ? rasterBottomRight.x
        : viewBottomRight.x,
      viewBottomRight.y > rasterBottomRight.y
        ? rasterBottomRight.y
        : viewBottomRight.y,
    );

    return { topLeft: calculatedTopLeft, bottomRight: calculatedBottomRight };
  }

  // 계산한 모서리, raster 이용해 변환한 전송할 최종 좌표를 구함
  function getConvertedCoordinate(
    topLeft: paper.Point,
    bottomRight: paper.Point,
    raster: paper.Raster,
  ) {
    return [
      topLeft.subtract(raster.bounds.topLeft),
      bottomRight.subtract(raster.bounds.topLeft),
    ];
  }

  async function loadSAM(modelType: string) {
    dispatch(setSAMModelLoading(true));
    try {
      const response = await SAMModel.loadModel(
        modelType ? modelType : 'vit_h',
      );
      if (response.status !== 200) throw new Error('Failed to load SAM');
      // dispatch(setIsSAMModelLoaded(true));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to load SAM');
      // TODO: prompt를 띄워 다시 로딩하시겠습니까? yes면 다시 load 트라이
      // dispatch(setIsSAMModelLoaded(false));
      alert(
        'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
      );
    } finally {
      // setIsSAMModelLoading(false);
      dispatch(setSAMModelLoading(false));
    }
  }

  async function embedImage(
    image: ImageType,
    topLeft: paper.Point,
    bottomRight: paper.Point,
  ) {
    if (!image) return;
    dispatch(setSAMEmbeddingId(null));
    dispatch(setSAMEmbeddingLoaded(false));
    if (image.width >= 4096 || image.height >= 4096) {
      alert(
        '이미지의 크기가 너무 큽니다. 4096 * 4096 이하의 이미지를 사용해주세요.',
      );
      return new Error('Image size is too big');
    }

    const imageId = image.imageId;
    // embed image, 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같다
    dispatch(setSAMEmbeddingLoading(true));
    try {
      const response = await SAMModel.embedImage(imageId, topLeft, bottomRight);
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

  // finetune model을 불러오는 함수
  async function loadFinetunedModel(finetuneId: number) {
    dispatch(setSAMModelLoading(true));
    try {
      const response = await FinetuneModel.loadFinetunedModel(finetuneId);
      if (response.status !== 200)
        throw new Error('Failed to load finetuned model');
    } catch (error) {
      axiosErrorHandler(error, 'Failed to load SAM');
      // TODO: prompt를 띄워 다시 로딩하시겠습니까? yes면 다시 load 트라이
      // dispatch(setIsSAMModelLoaded(false));
      alert(
        'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
      );
    } finally {
      // setIsSAMModelLoading(false);
      dispatch(setSAMModelLoading(false));
    }
  }

  useEffect(() => {
    if (!tempRect) return;
    tempRect.remove();
  }, [selectedTool, currentAnnotation]);

  return {
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseDrag,
    onMouseLeave,
    loadSAM,
    loadFinetunedModel,
    getRegion,
    getConvertedCoordinate,
  };
};

export default useSAMTool;
