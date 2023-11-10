import paper from 'paper';

let tempRect: paper.Path.Rectangle;

export function onSAMMouseDown() {
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
  const [a, b] = getConvertedCoordinate(topLeft, bottomRight, raster);

  // everything test
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
