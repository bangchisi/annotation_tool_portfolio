import paper from 'paper';
import { useCallback } from 'react';
import store from 'store';

import { useAppDispatch, useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { ImageType } from 'routes/Annotator/Annotator.types';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  selectSAM,
  setSAMClickLoading,
  setSAMEmbeddingId,
  setSAMEmbeddingLoading,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';

let tempRect: paper.Path.Rectangle;

const useSAMTool = () => {
  const coords: [number, number][] = [];
  const labels: number[] = [];
  const dispatch = useAppDispatch();
  const { image, currentCategory, currentAnnotation } =
    useAppSelector(selectAnnotator);

  const onMouseDown = useCallback(
    (event: paper.MouseEvent) => {
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

      // draw SAM Region
      if (tempRect) tempRect.remove();

      tempRect = new paper.Path.Rectangle({
        from: topLeft,
        to: bottomRight,
        strokeColor: new paper.Color('red'),
        strokeWidth: 5,
        guide: true,
      });

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

      labels.push(clickMode);
      coords.push([clickedX, clickedY]);

      embedImage(image, calculatedTopLeft, calculatedBottomRight).then(() => {
        click(image.imageId, calculatedTopLeft, calculatedBottomRight, [x, y]);
      });
    },
    [image, currentCategory, currentAnnotation],
  );

  const onMouseUp = useCallback(() => {
    // up
  }, []);

  const onMouseMove = useCallback(() => {
    // move
  }, []);

  const onMouseDrag = useCallback(() => {
    // drag
  }, []);

  const click = async (
    imageId: number,
    topLeft: paper.Point,
    bottomRight: paper.Point,
    correction: number[],
  ) => {
    if (!image) return;

    // console.log('coords');
    // console.log(coords[coords.length - 1]);
    // console.log('labels');
    // console.log(labels);

    dispatch(setSAMClickLoading(true));
    try {
      const response = await SAMModel.click(
        imageId,
        coords,
        labels,
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
    // segmentation의 모든 숫자에 1을 더해서 temp라는 변수에 넣어줌
    const correctedSegmentation = segmentation.map((path) => {
      return path.map((point) => {
        return [point[0] + correction[0], point[1] + correction[1]];
      });
    });

    compound.addChildren(
      correctedSegmentation.map((path) => {
        return new paper.Path(path);
      }),
    );
  };

  return { onMouseDown, onMouseUp, onMouseMove, onMouseDrag };
};

// view.bounds와 raster.bounds의 교차점을 구함
export function getRegion(
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
export function getConvertedCoordinate(
  topLeft: paper.Point,
  bottomRight: paper.Point,
  raster: paper.Raster,
) {
  return [
    topLeft.subtract(raster.bounds.topLeft),
    bottomRight.subtract(raster.bounds.topLeft),
  ];
}

export async function loadSAM(modelType: string) {
  store.dispatch(setSAMModelLoading(true));
  try {
    const response = await SAMModel.loadModel(modelType ? modelType : 'vit_l');
    console.log('response');
    console.dir(response);
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
    store.dispatch(setSAMModelLoading(false));
  }
}

export async function embedImage(
  image: ImageType,
  topLeft: paper.Point,
  bottomRight: paper.Point,
) {
  if (!image) return;
  const imageId = image.imageId;
  // embed image, 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같다
  store.dispatch(setSAMEmbeddingLoading(true));
  try {
    const response = await SAMModel.embedImage(
      imageId,
      topLeft,
      bottomRight,
      // new paper.Point(0, 0),
      // new paper.Point(image.width, image.height),
    );
    store.dispatch(setSAMEmbeddingId(imageId));
    console.log('image embedding response');
    console.log(response);
  } catch (error) {
    axiosErrorHandler(error, 'Failed to get image embedding');
    store.dispatch(setSAMEmbeddingId(null));
  } finally {
    store.dispatch(setSAMEmbeddingLoading(false));
  }
}

// finetune model을 불러오는 함수
export async function loadFinetunedModel(finetuneId: number) {
  store.dispatch(setSAMModelLoading(true));
  try {
    const response = await FinetuneModel.loadFinetunedModel(finetuneId);
    console.log('response');
    console.dir(response);
  } catch (error) {
    axiosErrorHandler(error, 'Failed to load SAM');
    // TODO: prompt를 띄워 다시 로딩하시겠습니까? yes면 다시 load 트라이
    // dispatch(setIsSAMModelLoaded(false));
    alert(
      'SAM을 불러오는데 실패했습니다. 다른 툴을 선택했다 SAM을 다시 선택해주세요.',
    );
  } finally {
    // setIsSAMModelLoading(false);
    store.dispatch(setSAMModelLoading(false));
  }
}

export default useSAMTool;
