import paper from 'paper';
import { useCallback } from 'react';
import store from 'store';

import { useAppDispatch } from 'App.hooks';

import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { ImageType } from 'routes/Annotator/Annotator.types';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  setSAMClickLoading,
  setSAMEmbeddingId,
  setSAMEmbeddingLoading,
  setSAMModelLoading,
} from 'routes/Annotator/slices/SAMSlice';

let tempRect: paper.Path.Rectangle;

const useSAMTool = () => {
  const dispatch = useAppDispatch();

  const onMouseDown = useCallback(() => {
    const viewBounds = paper.view.bounds;
    const raster = paper.project.activeLayer.children.find(
      (child) => child instanceof paper.Raster,
    ) as paper.Raster;
    if (!raster) return;
    const rasterBounds = raster.bounds;

    const { topLeft, bottomRight } = getRegion(viewBounds, rasterBounds);

    console.log('boundary');

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
    console.log(calculatedTopLeft, calculatedBottomRight);
    click();
  }, []);

  const onMouseUp = useCallback(() => {
    // up
  }, []);

  const onMouseMove = useCallback(() => {
    // move
  }, []);

  const onMouseDrag = useCallback(() => {
    // drag
  }, []);

  const click = async () => {
    dispatch(setSAMClickLoading(true));
    setTimeout(() => {
      dispatch(setSAMClickLoading(false));
    }, 1000);
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

export async function embedImage(image: ImageType) {
  if (!image) return;
  const imageId = image.imageId;
  // embed image, 전체 크기에 대한 embedding이기 때문에 좌표는 이미지 크기 값과 같다
  store.dispatch(setSAMEmbeddingLoading(true));
  try {
    const response = await SAMModel.embedImage(
      imageId,
      new paper.Point(0, 0),
      new paper.Point(image.width, image.height),
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
