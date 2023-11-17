import { axiosErrorHandler } from 'helpers/Axioshelpers';
import paper from 'paper';
import SAMModel from 'routes/Annotator/models/SAM.model';
import {
  setSAMEverythingLoading,
  setSAMModelLoading,
} from 'routes/Annotator/slices/annotatorSlice';
import store from 'store';

let tempRect: paper.Path.Rectangle;

export function onSAMMouseDown(
  isSAMModelLoaded: boolean,
  setIsEverythingLoading: React.Dispatch<React.SetStateAction<boolean>>,
  embeddedImageId?: number,
  categoryId?: number,
  imageId?: number,
) {
  console.log('SAM mouse down');
  const viewBounds = paper.view.bounds;
  const raster = paper.project.activeLayer.children.find(
    (child) => child instanceof paper.Raster,
  ) as paper.Raster;
  if (!raster) return;
  const rasterBounds = raster.bounds;

  const { topLeft, bottomRight } = getRegion(viewBounds, rasterBounds);

  console.log('boundary');
  console.dir(
    `(${topLeft.x}, ${topLeft.y}), (${bottomRight.x}, ${bottomRight.y})`,
  );

  // draw SAM Region
  if (tempRect) tempRect.remove();

  tempRect = new paper.Path.Rectangle({
    from: topLeft,
    to: bottomRight,
    strokeColor: new paper.Color('red'),
    strokeWidth: 5,
    guide: true,
  });

  // prompt, everything api 요청
  const [calculatedTopLeft, calculatedBottomRight] = getConvertedCoordinate(
    topLeft,
    bottomRight,
    raster,
  );

  console.log(calculatedTopLeft);
  console.log(calculatedBottomRight);

  // everything test
  // FIX: 불러온 그림들이 raster subtract 만큼 왼쪽 위로 표시됨
  if (!categoryId || !imageId) return;
  everything(
    imageId,
    categoryId,
    calculatedTopLeft,
    calculatedBottomRight,
    {
      predIOUThresh: 0.88,
      boxNmsThresh: 0.7,
      pointsPerSide: 32,
    },
    isSAMModelLoaded,
    setIsEverythingLoading,
    embeddedImageId,
  );
}

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

export function getViewBounds(imageWidth: number, imageHeight: number) {
  // view
  const viewTopLeft = paper.view.bounds.topLeft;
  const viewBottomRight = paper.view.bounds.bottomRight;

  // image
  const imageTopLeft = new paper.Point(0, 0);
  imageTopLeft.x = -(imageWidth / 2);
  imageTopLeft.y = -(imageHeight / 2);
  const imageBottomRight = new paper.Point(0, 0);
  imageBottomRight.x = imageWidth / 2;
  imageBottomRight.y = imageHeight / 2;

  // result
  const resultTopLeft = new paper.Point(0, 0);
  resultTopLeft.x =
    imageTopLeft.x > viewTopLeft.x ? imageTopLeft.x : viewTopLeft.x;
  resultTopLeft.y =
    imageTopLeft.y > viewTopLeft.y ? imageTopLeft.y : viewTopLeft.y;
  const resultBottomRight = new paper.Point(0, 0);
  resultBottomRight.x =
    imageBottomRight.x < viewBottomRight.x
      ? imageBottomRight.x
      : viewBottomRight.x;
  resultBottomRight.y =
    imageBottomRight.y < viewBottomRight.y
      ? imageBottomRight.y
      : viewBottomRight.y;

  const imageLeftTopCoord = resultTopLeft.add(imageBottomRight);
  const imageRightBottomCoord = resultBottomRight.add(imageBottomRight);

  return {
    resultTopLeft,
    resultBottomRight,
    imageLeftTopCoord,
    imageRightBottomCoord,
  };
}

async function everything(
  imageId: number,
  categoryId: number,
  topLeft: paper.Point,
  bottomRight: paper.Point,
  params: {
    predIOUThresh: number;
    boxNmsThresh: number;
    pointsPerSide: number;
  },
  isSAMModelLoaded: boolean,
  setIsEverythingLoading: React.Dispatch<React.SetStateAction<boolean>>,
  embeddedImageId?: number,
) {
  if (!isSAMModelLoaded) return;
  if (!embeddedImageId || embeddedImageId !== imageId) return;
  setIsEverythingLoading(true);
  try {
    const response = SAMModel.everything(
      imageId,
      categoryId,
      topLeft,
      bottomRight,
      params,
    );

    console.log('everything, response');
    console.log(response);
  } catch (error) {
    axiosErrorHandler(error, 'Failed to SAM Everything');
    alert('everything 모드 실패, 다시 시도해주세요.');
  } finally {
    setIsEverythingLoading(false);
  }
}

export async function loadSAM(modelType?: string) {
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

export function dummy() {
  store.dispatch(setSAMEverythingLoading(true));
}
