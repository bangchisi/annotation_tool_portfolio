import { useAppSelector } from 'App.hooks';
import { useMemo } from 'react';
import { Tool } from 'routes/Annotator/Annotator';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';

// tools
import { ImageType } from 'routes/Annotator/Annotator.types';
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSAMTool from '../tools/useSAMTool';
import useSelectTool from '../tools/useSelectTool';

import paper from 'paper';
import { Tool as ToolType } from 'routes/Annotator/Annotator';

export type ToolCommand = {
  toolType: ToolType;

  // 이전에 존재했던 annotation들만 비교하기 위한 id 목록
  annotationIds: string[];

  // undo, redo를 위한 이전 상태
  layer: paper.Layer;

  // 편집 전후 마스킹 비교를 위한 해시값
  hash: string;
};

export class AnnotationTool extends paper.Tool {
  toolType: ToolType;

  constructor(toolType: ToolType) {
    super();
    this.toolType = toolType;
  }
}

export class ToolHistory {
  undo: ToolCommand[];
  redo: ToolCommand[];

  constructor() {
    this.undo = [];
    this.redo = [];
  }
}

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
  const samTool = useSAMTool().tool;

  const selectedToolInstances = useMemo(
    () => ({
      [Tool.Brush]: brushTool,
      [Tool.Box]: boxTool,
      [Tool.Eraser]: eraserTool,
      [Tool.Select]: selectTool,
      [Tool.SAM]: samTool,
    }),
    [brushTool, boxTool, eraserTool, selectTool, samTool],
  );

  const selectedToolInstance = useMemo(
    () => selectedToolInstances[selectedTool],
    [selectedToolInstances, selectedTool],
  );

  return selectedToolInstance;
};

export default useTools;
