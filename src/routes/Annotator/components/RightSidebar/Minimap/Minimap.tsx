import paper from 'paper';

import { useEffect, useRef } from 'react';
import { Container } from './Minimap.style';
import { getCanvasImage } from 'helpers/ImagesHelpers';
import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectRef = useRef<paper.Path.Rectangle>();
  const { image } = useAppSelector(selectAnnotator);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log(canvasRef.current.width);
    console.log(canvasRef.current.height);

    if (!image) return;

    const scope = new paper.PaperScope();
    scope.setup(canvas);

    const url = getCanvasImage(image?.imageId);
    const raster = new scope.Raster(url);

    scope.project.activeLayer.addChild(raster);
    raster.sendToBack();
    scope.view.viewSize = new scope.Size(image.width, image.height).multiply(
      0.4,
    );
    scope.view.scale(0.4, new scope.Point(image.width / 2, image.height / 2));

    const minimapHanlder = () => {
      if (rectRef.current) rectRef.current.remove();
      scope.activate();
      rectRef.current = new scope.Path.Rectangle({
        from: paper.view.bounds.topLeft,
        to: paper.view.bounds.bottomRight,
        strokeColor: new scope.Color('red'),
        strokeWidth: 3,
      });
    };

    paper.view.on('minimap', minimapHanlder);

    return () => {
      scope.project.clear();
      paper.view.off('minimap', minimapHanlder);
    };
  }, [image]);

  return (
    <Container>
      <canvas ref={canvasRef} />
    </Container>
  );
}
