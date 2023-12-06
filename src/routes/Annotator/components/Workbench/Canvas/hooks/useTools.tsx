import { useMemo } from 'react';
import { Tool } from 'routes/Annotator/Annotator';

// tools
import { ImageType } from 'routes/Annotator/Annotator.types';
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSAMTool from '../tools/useSAMTool';
import useSelectTool from '../tools/useSelectTool';

import paper from 'paper';
import { Tool as ToolType } from 'routes/Annotator/Annotator';

import hash from 'object-hash';
import { compoundPathToSegmentation } from 'routes/Annotator/helpers/Annotator.helper';

type ToolCommandArgs = {
  // reserved
  toolType: ToolType | -1;

  // undo, redo를 위한 이전 상태
  serializedLayer: string;

  // 라벨링 전후 마스킹 비교를 위한 해시값
  layerHash: string;
};

class ToolCommand {
  toolType: ToolType | -1;
  serializedLayer: string;
  layerHash: string;

  constructor(args: ToolCommandArgs) {
    this.toolType = args.toolType;
    this.serializedLayer = args.serializedLayer;
    this.layerHash = args.layerHash;
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

// Canvas unmount 시, 히스토리 초기화
export class AnnotationTool extends paper.Tool {
  toolType: ToolType;
  isDrawing: boolean;
  static history: ToolHistory = new ToolHistory();

  constructor(toolType: ToolType) {
    super();
    this.toolType = toolType;
    this.isDrawing = false;

    this.on('keydown', (event: paper.KeyEvent) => {
      if (event.key === 'z' && event.modifiers.control) {
        this.undo();
      } else if (event.key === 'y' && event.modifiers.control) {
        this.redo();
      }
    });
  }

  startDrawing() {
    this.isDrawing = true;
  }

  endDrawing() {
    this.isDrawing = false;

    // 데이터 복구를 위해 Layer 전체를 serialize
    const serializedLayer = paper.project.activeLayer.exportJSON({
      asString: true,
    });

    // 모든 CompoundPath를 가져옴
    const compoundPaths = paper.project.activeLayer.children || [];

    // CompoundPath들을 segmentation으로 변환
    const segmentations = compoundPaths
      // CompoundPath만 가져옴
      .filter((compoundPath) => {
        if (compoundPath instanceof paper.CompoundPath) {
          return true;
        } else {
          return false;
        }
      })
      // 빈 CompoundPath는 제거
      .filter((compoundPath) => compoundPath.children.length > 0)
      // annotationId를 기준으로 Ascending order로 정렬
      .sort(
        (a, b) =>
          Number(a.data.annotationId) - Number(b.data.annotationId) ?? 0,
      )
      // CompoundPath를 segmentation으로 변환
      .map((compoundPath) =>
        compoundPathToSegmentation(compoundPath as paper.CompoundPath),
      );

    // segmentations 해시값을 통해 레이어 해시값 생성
    const segmentationStrings = segmentations.map((segmentation) =>
      JSON.stringify(segmentation),
    );
    const layerHash = hash.MD5(JSON.stringify(segmentationStrings));

    const toolCommand = new ToolCommand({
      toolType: this.toolType,
      serializedLayer,
      layerHash,
    });

    // 히스토리에 저장
    const { history } = AnnotationTool;

    // undo가 비어있을 경우 (초기 상태), 현재 상태를 저장
    if (history.undo.length === 0) {
      const initialLayer = paper.project.activeLayer.exportJSON({
        asString: true,
      });
      history.undo.push(
        new ToolCommand({
          toolType: -1,
          serializedLayer: initialLayer,
          layerHash: '',
        }),
      );
    }

    // 상태 변경이 있을 시, 히스토리에 저장
    const lastCommand = history.undo[history.undo.length - 1];

    const lastLayerHash = lastCommand.layerHash;
    if (layerHash !== lastLayerHash) {
      history.undo.push(toolCommand);

      // redo 히스토리 초기화
      if (history.redo.length > 0) {
        history.redo = [];
      }
    }
    // 상태 변경이 없을 시, 히스토리에 저장하지 않음
    else {
      return;
    }
  }
  // @Todo: undo, redo count 제한
  undo() {
    const { history } = AnnotationTool;

    // undo 히스토리가 비어있으면 아무 것도 하지 않음
    if (history.undo.length === 0) {
      return;
    }

    // undo 히스토리에서 마지막 상태를 가져옴
    const lastUndoCommand = history.undo.pop();

    // redo 히스토리에 마지막 상태를 저장
    history.redo.push(lastUndoCommand as ToolCommand);

    // 마지막 상태로 캔버스를 복구
    const lastSerializedLayer = lastUndoCommand?.serializedLayer;
    paper.project.activeLayer.removeChildren();
    paper.project.activeLayer.importJSON(lastSerializedLayer as string);
  }
  redo() {
    const { history } = AnnotationTool;

    // redo 히스토리가 비어있으면 아무 것도 하지 않음
    if (history.redo.length === 0) {
      return;
    }

    // redo 히스토리에서 마지막 상태를 가져옴
    const lastRedoCommand = history.redo.pop();

    // undo 히스토리에 마지막 상태를 저장
    history.undo.push(lastRedoCommand as ToolCommand);

    // 마지막 상태로 캔버스를 복구
    const lastSerializedLayer = lastRedoCommand?.serializedLayer;
    paper.project.activeLayer.removeChildren();
    paper.project.activeLayer.importJSON(lastSerializedLayer as string);
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

  return selectedToolInstances;
};

export default useTools;
