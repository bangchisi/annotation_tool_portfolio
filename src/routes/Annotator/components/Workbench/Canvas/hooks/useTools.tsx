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

  const brushTool = useBrushTool(canvasChildren);
  const boxTool = useBoxTool(canvasChildren);
  const eraserTool = useEraserTool(canvasChildren);
  const selectTool = useSelectTool();
  const samTool = useSAMTool();

  const toolHandlers = useMemo(
    () => ({
      [Tool.Brush]: brushTool,
      [Tool.Box]: boxTool,
      [Tool.Eraser]: eraserTool,
      [Tool.Select]: selectTool,
      [Tool.SAM]: samTool,
    }),
    [brushTool, boxTool, eraserTool, selectTool, samTool],
  );

  const selectedToolHandler = useMemo(
    () => toolHandlers[selectedTool],
    [selectedTool, toolHandlers],
  );

  return selectedToolHandler;
};

export default useTools;
