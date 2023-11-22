import { Tool } from 'routes/Annotator/Annotator';
import { ImageType } from 'routes/Annotator/Annotator.types';

import { useMemo } from 'react';

import { useAppSelector } from 'App.hooks';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

// tools
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSelectTool from '../tools/useSelectTool';
import useSAMTool from '../tools/useSAMTool';
import { selectAuth } from 'routes/Auth/slices/authSlice';

interface UseToolsProps {
  selectedTool: Tool;
  canvasChildren: paper.Item[];
  datasetId?: number;
  imageId?: number;
  image?: ImageType;
}

const useTools = (props: UseToolsProps) => {
  const { selectedTool } = useAppSelector(selectAnnotator);
  const { brushRadius } = useAppSelector(selectAuth).preference;
  const { canvasChildren } = props;

  const selectTool = useSelectTool();
  const brushTool = useBrushTool(canvasChildren);
  const boxTool = useBoxTool(canvasChildren);
  const eraserTool = useEraserTool(canvasChildren);
  const SAMTool = useSAMTool();

  const toolHandlers = useMemo(() => {
    return {
      [Tool.Select]: selectTool,
      [Tool.Brush]: brushTool,
      [Tool.Box]: boxTool,
      [Tool.Eraser]: eraserTool,
      [Tool.SAM]: SAMTool,
    };
  }, [selectedTool, brushRadius]);

  return {
    onMouseDown: toolHandlers[selectedTool].onMouseDown,
    onMouseUp: toolHandlers[selectedTool].onMouseUp,
    onMouseDrag: toolHandlers[selectedTool].onMouseDrag,
    onMouseMove: toolHandlers[selectedTool].onMouseMove,
    onMouseLeave: toolHandlers[selectedTool].onMouseLeave,
  };
};

export default useTools;
