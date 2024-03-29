import paper from 'paper';

import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { ImageType } from 'routes/Annotator/Annotator.types';
import useManageTool from 'routes/Annotator/components/Workbench/Canvas/tools/useManageTool';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  setSAMClickLoading,
  setSAMEmbeddingId,
  setSAMEmbeddingLoaded,
  setSAMEmbeddingLoading,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';
import { Tool } from 'types';

const useSAMTool = () => {
  const tempRect = useRef<paper.Path.Rectangle | null>(null);
  const coords = useRef<[number, number][]>([]);
  const labels = useRef<number[]>([]);

  const dispatch = useAppDispatch();
  const { selectedTool, image, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const tool = useManageTool(Tool.SAM);

  useEffect(() => {
    coords.current = [];
    labels.current = [];
  }, [selectedTool, currentAnnotation]);

  const setChildrenWithSegmentation = (
    segmentation: number[][][],
    correction: number[],
  ) => {
    const children = paper.project.activeLayer.children as paper.CompoundPath[];
    const compound = children.find(
      (child) =>
        child.data.annotationId === currentAnnotation?.annotationId &&
        child.data.categoryId === currentCategory?.categoryId,
    );

    if (!compound) return;

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

  // view.bounds와 raster.bounds의 교차점을 구함
  const getRegion = (
    viewBounds: paper.Rectangle,
    rasterBounds: paper.Rectangle,
  ) => {
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
  };

  // 계산한 모서리, raster 이용해 변환한 전송할 최종 좌표를 구함
  const getConvertedCoordinate = (
    topLeft: paper.Point,
    bottomRight: paper.Point,
    raster: paper.Raster,
  ) => {
    return [
      topLeft.subtract(raster.bounds.topLeft),
      bottomRight.subtract(raster.bounds.topLeft),
    ];
  };

  const embedImage = async (
    image: ImageType,
    topLeft: paper.Point,
    bottomRight: paper.Point,
  ) => {
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
  };

  tool.onMouseDown = function (event: paper.MouseEvent) {
    event.preventDefault();
    if (!image || !currentCategory || !currentAnnotation) return;

    this.startDrawing(() => {
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
          click(image.imageId, calculatedTopLeft, calculatedBottomRight, [
            x,
            y,
          ]).then(() => {
            this.endDrawing(currentAnnotation?.annotationId || 0);
          });

          // draw SAM Region
          const SAMGuideBox = tempRect.current;
          if (SAMGuideBox) SAMGuideBox.remove();

          tempRect.current = new paper.Path.Rectangle({
            from: topLeft,
            to: bottomRight,
            strokeColor: new paper.Color('red'),
            strokeWidth: 5,
            guide: true,
          });
        },
      );
    });
  };

  const loadSAM = async (modelType: string) => {
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
      dispatch(setSAMModelLoading(false));
    }
  };

  // finetune model을 불러오는 함수
  const loadFinetunedModel = async (finetuneId: number) => {
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
  };

  useEffect(() => {
    if (!tempRect || !tempRect.current) return;
    tempRect.current.remove();
  }, [selectedTool, currentAnnotation]);

  return {
    tool,
    loadSAM,
    loadFinetunedModel,
    getRegion,
    getConvertedCoordinate,
  };
};

export default useSAMTool;
