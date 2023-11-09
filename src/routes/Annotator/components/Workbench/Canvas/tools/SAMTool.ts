import paper from 'paper';

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
