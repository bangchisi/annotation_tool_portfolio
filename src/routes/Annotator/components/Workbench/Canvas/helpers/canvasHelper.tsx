// import axios from 'axios';
import paper from 'paper';

interface fetchImageProps {
  datasetId: number;
  imageId: number;
}

export function onCanvasMouseDown(event: paper.MouseEvent): void {
  event.preventDefault();
  console.log('canvas mouse down', event.point);
  console.log(event.point.subtract(paper.view.center));
  // console.log('canvas mouse down', paper.view.bounds);
  // const bounds = paper.view.bounds;

  // const redRect = new paper.Path.Rectangle(bounds);
  // redRect.strokeColor = new paper.Color('red');
  // redRect.strokeWidth = 1;
}

export function onCanvasMouseUp(event: paper.MouseEvent): void {
  event.preventDefault();
  // console.log('canvas mouse up', event);
}

export function onCanvasDrag(event: paper.MouseEvent): void {
  event.preventDefault();
  paper.view.center = paper.view.center.subtract(event.delta);
}

export function onCanvasDragStart(event: paper.MouseEvent): void {
  console.log('canvas drag start', event);
}

export function onCanvasDragEnd(event: paper.MouseEvent): void {
  console.log('canvas drag end', event);
}

export function onCanvasWheel(event: WheelEvent): void {
  // paper.js don't have wheel event
  event.preventDefault();
  const dragAmount = 30;

  if (event.ctrlKey) {
    if (event.deltaY < 0) {
      paper.view.center = paper.view.center.subtract(
        new paper.Point(0, dragAmount),
      );
    } else {
      paper.view.center = paper.view.center.add(new paper.Point(0, dragAmount));
    }
  } else if (event.shiftKey) {
    if (event.deltaY < 0) {
      paper.view.center = paper.view.center.subtract(
        new paper.Point(dragAmount, 0),
      );
    } else {
      paper.view.center = paper.view.center.add(new paper.Point(dragAmount, 0));
    }
  } else {
    if (event.deltaY < 0) {
      paper.view.zoom += 0.1;
    } else if (paper.view.zoom > 0.2 && event.deltaY > 0) {
      paper.view.zoom -= 0.1;
    }
  }
}

export async function fetchImage({
  datasetId,
  imageId,
}: fetchImageProps): Promise<HTMLImageElement | null> {
  if (datasetId > 0) {
    console.log(
      `fetchImage(), { datasetId: ${datasetId}, imageId: ${imageId} }`,
    );
  }
  // try {
  //   const response = await axios.get(`/api/image/${datasetId}/${imageId}`);
  //   console.log(response);
  // } catch (error) {
  //   if (error instanceof Error) {
  //     console.log('Failed fetchImage');
  //     console.log(error.stack);
  //     return null;
  //   }
  // }

  const img = new Image();
  img.src = 'https://placehold.it/500x500';
  // console.log('fetchImage(), result');
  // console.dir(img);
  return img;
}

export function drawAnnotation(
  containerWidth: number,
  containerHeight: number,
  imgWidth: number,
  imgHeight: number,
) {
  console.log('drawAnnotation');
  interface AnnotationType {
    points: number[][];
    color: string;
  }

  const annotations: AnnotationType[] = [
    {
      points: [
        [100, 100],
        [200, 100],
        [200, 200],
        [100, 200],
      ],
      color: 'red',
    },
    {
      points: [
        [300, 300],
        [400, 300],
        [400, 400],
        [300, 400],
      ],
      color: 'blue',
    },
  ];

  for (const annotation of annotations) {
    const center = new paper.Point(containerWidth / 2, containerHeight / 2);
    const newZero = center.subtract(new paper.Point(imgWidth, imgHeight));
    const polygon: paper.Path = new paper.Path();
    polygon.strokeColor = new paper.Color(annotation.color);
    polygon.closed = true;

    for (const point of annotation.points) {
      const [x, y] = point;
      polygon.add(newZero.add(new paper.Point(x, y)));
    }
  }
}

export function getViewBounds(imageWidth: number, imageHeight: number) {
  // view
  const viewTopLeft = paper.view.bounds.topLeft;
  const viewBottomRight = paper.view.bounds.bottomRight;

  // image
  const imageTopLeft = new paper.Point(-(imageWidth / 2), -(imageHeight / 2));
  const imageBottomRight = new paper.Point(imageWidth / 2, imageHeight / 2);

  // result
  const resultTopLeft = new paper.Point(
    imageTopLeft.x > viewTopLeft.x ? imageTopLeft.x : viewTopLeft.x,
    imageTopLeft.y > viewTopLeft.y ? imageTopLeft.y : viewTopLeft.y,
  );
  const resultBottomRight = new paper.Point(
    imageBottomRight.x < viewBottomRight.x
      ? imageBottomRight.x
      : viewBottomRight.x,
    imageBottomRight.y < viewBottomRight.y
      ? imageBottomRight.y
      : viewBottomRight.y,
  );

  const imageLeftTopCoord = resultTopLeft.add(imageBottomRight);
  const imageRightBottomCoord = resultBottomRight.add(imageBottomRight);

  return {
    resultTopLeft,
    resultBottomRight,
    imageLeftTopCoord,
    imageRightBottomCoord,
  };
}
