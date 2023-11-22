import { Tool } from 'routes/Annotator/Annotator';
import { ImageType } from 'routes/Annotator/Annotator.types';

import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

// tools
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSelectTool from '../tools/useSelectTool';
import useSAMTool from '../tools/useSAMTool';

interface UseToolsProps {
  selectedTool: Tool;
  canvasChildren: paper.Item[];
  datasetId?: number;
  imageId?: number;
  image?: ImageType;
}

const useTools = (props: UseToolsProps) => {
  const { selectedTool } = useAppSelector(selectAnnotator);
  const { canvasChildren } = props;

  const selectTool = useSelectTool();
  const brushTool = useBrushTool(canvasChildren);
  const boxTool = useBoxTool(canvasChildren);
  const eraserTool = useEraserTool(canvasChildren);
  const SAMTool = useSAMTool();

  // 마우스 클릭
  const onMouseDown = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      selectTool.onMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      brushTool.onMouseDown();
    } else if (selectedTool === Tool.Box) {
      boxTool.onMouseDown(event);
    } else if (selectedTool === Tool.Eraser) {
      eraserTool.onMouseDown();
    } else if (selectedTool === Tool.SAM) {
      SAMTool.onMouseDown();
      // onSAMMouseDown(
      //   SAMModelLoaded,
      //   embeddingId,
      //   currentCategory?.categoryId,
      //   imageId,
      // );
    }
  };

  // 마우스 업
  const onMouseUp = () => {
    // console.log(event);
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      brushTool.onMouseUp();
    } else if (selectedTool === Tool.Box) {
      boxTool.onMouseUp();
    } else if (selectedTool === Tool.Eraser) {
      eraserTool.onMouseUp();
    }
  };

  // 마우스 움직임
  const onMouseMove = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      brushTool.onMouseMove(event);
    } else if (selectedTool === Tool.Box) {
      boxTool.onMouseMove(event);
    } else if (selectedTool === Tool.Eraser) {
      eraserTool.onMouseMove(event);
    }
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      selectTool.onMouseDrag(event);
    } else if (selectedTool === Tool.Brush) {
      brushTool.onMouseDrag(event);
    } else if (selectedTool === Tool.Eraser) {
      eraserTool.onMouseDrag(event);
    }
  };

  return {
    onMouseDown,
    onMouseUp,
    onMouseDrag,
    onMouseMove,
  };
};

export default useTools;
