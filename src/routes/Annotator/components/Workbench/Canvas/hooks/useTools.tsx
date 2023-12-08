import { useMemo } from 'react';

// tools
import { ImageType } from 'routes/Annotator/Annotator.types';
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSAMTool from '../tools/useSAMTool';
import useSelectTool from '../tools/useSelectTool';

import paper from 'paper';

import hash from 'object-hash';
import { Tool } from 'types';

const MutationTypeTool = [Tool.Brush, Tool.Box, Tool.Eraser, Tool.SAM];

type ToolCommandArgs = {
  // reserved
  toolType: Tool | -1;

  // undo, redo를 위한 이전 상태
  serializedLayer: string;

  // 라벨링 전후 마스킹 비교를 위한 해시값
  layerHash: string;
};

class ToolCommand {
  toolType: Tool | -1;
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
  toolType: Tool;
  isDrawing: boolean;
  private initialLayerState = '';
  static history: ToolHistory = new ToolHistory();

  constructor(toolType: Tool) {
    super();
    this.toolType = toolType;
    this.isDrawing = false;

    this.on('keydown', (event: paper.KeyEvent) => {
      console.log(AnnotationTool.history);
      if (event.key === 'z' && event.modifiers.control) {
        this.undo();
      } else if (event.key === 'y' && event.modifiers.control) {
        this.redo();
      }
    });
  }

  startDrawing() {
    // 레이어를 편집하는 툴이 아닐 경우, 아무 것도 하지 않음
    if (!MutationTypeTool.includes(this.toolType)) return;

    this.isDrawing = true;

    if (AnnotationTool.history.undo.length === 0) {
      this.initializeHistory();
    }
  }

  endDrawing() {
    // 레이어를 편집하는 툴이 아닐 경우, 아무 것도 하지 않음
    if (!MutationTypeTool.includes(this.toolType)) return;

    this.isDrawing = false;

    const { history } = AnnotationTool;

    // 복구를 위해, 마지막 편집 후의 레이어 상태를 저장
    const serializedLayer = this.serializeLayer();

    // 현재 레이어 상태를 해시값으로 환산
    const layerHash = this.getLayerHash();

    // 툴커맨드 생성
    const toolCommand = new ToolCommand({
      toolType: this.toolType,
      serializedLayer,
      layerHash,
    });

    // 히스토리가 비어있으면 히스토리에 저장
    if (history.undo.length === 0) {
      history.undo.push(toolCommand);
      return;
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
      return;
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
    if (history.undo.length === 0) return;

    // undo 히스토리에서 마지막 상태를 가져옴
    const lastUndoCommand = history.undo.pop();

    // redo 히스토리에 마지막 상태를 저장
    history.redo.push(lastUndoCommand as ToolCommand);

    // 마지막 상태로 캔버스를 복구
    this.restoreLastLayer();
  }

  redo() {
    const { history } = AnnotationTool;
    // redo 히스토리가 비어있으면 아무 것도 하지 않음
    if (history.redo.length === 0) return;

    // redo 히스토리에서 마지막 상태를 가져옴
    const lastRedoCommand = history.redo.pop();

    // undo 히스토리에 마지막 상태를 저장
    history.undo.push(lastRedoCommand as ToolCommand);

    // 마지막 상태로 캔버스를 복구
    this.restoreLastLayer();
  }

  private restoreLastLayer() {
    const { history } = AnnotationTool;
    // undo 히스토리가 비어있으면 초기에 저장한 레이어 상태로 복구
    if (history.undo.length === 0) {
      paper.project.activeLayer.removeChildren();
      paper.project.activeLayer.importJSON(this.initialLayerState);
      return;
    }

    // 마지막 상태로 캔버스를 복구
    const lastLayerState = history.undo[history.undo.length - 1];
    const lastSerializedLayer = lastLayerState?.serializedLayer;
    paper.project.activeLayer.removeChildren();
    paper.project.activeLayer.importJSON(lastSerializedLayer as string);
  }

  private getLayerHash() {
    // 모든 CompoundPath를 가져옴
    const compoundPaths = paper.project.activeLayer.children || [];

    // 각각의 CompoundPath를 해시로 환산한 값을 배열로 저장
    const compoundPathsHashes =
      compoundPaths
        // 빈 CompoundPath는 제거
        .filter((compoundPath) => compoundPath.children?.length > 0)
        // annotationId를 기준으로 Ascending order로 정렬
        .sort(
          (a, b) =>
            Number(a.data.annotationId) - Number(b.data.annotationId) ?? 0,
        )
        // 각각의 CompoundPath를 해시로 환산
        .map((compoundPath) =>
          hash.MD5(
            JSON.stringify(
              compoundPath.exportJSON({
                asString: true,
              }),
            ),
          ),
        ) ||
      // 현재 레이어 위에 마스킹이 없을 경우, 빈 배열을 반환
      [];
    // 결과값을 통해 레이어 해시값 생값
    const layerHash = hash.MD5(JSON.stringify(compoundPathsHashes));

    return layerHash;
  }

  private serializeLayer() {
    // 레이어를 클론하고 visible을 false로 설정
    const clonedLayer = paper.project.activeLayer.clone();
    // clonedLayer.visible = false;

    // 레이어 위에서 Path를 삭제함 (Raster, CompoundPath는 남겨둠)
    const clonedLayerChildren = clonedLayer.children || [];
    clonedLayerChildren.forEach((child) => {
      console.log(child instanceof paper.Raster);
      if (
        child instanceof paper.Raster ||
        child instanceof paper.CompoundPath
      ) {
        return;
      }
      child.remove();
    });

    const serializedLayer = clonedLayer.exportJSON({
      asString: true,
    });

    clonedLayer.remove();

    return serializedLayer;
  }

  private initializeHistory() {
    // 초기 레이어 상태 저장
    if (AnnotationTool.history.undo.length === 0) {
      this.initialLayerState = this.serializeLayer();
    }
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
