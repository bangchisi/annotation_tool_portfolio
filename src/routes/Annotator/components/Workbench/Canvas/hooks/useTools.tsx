import { useMemo } from 'react';

// tools
import useBoxTool from '../tools/useBoxTool';
import useBrushTool from '../tools/useBrushTool';
import useEraserTool from '../tools/useEraserTool';
import useSAMTool from '../tools/useSAMTool';
import useSelectTool from '../tools/useSelectTool';

import paper from 'paper';

import hash from 'object-hash';
import { MutationTypeTool, Tool } from 'types';

type ToolCommandArgs = {
  // reserved
  toolType: Tool | -1;

  // undo, redo를 위한 이전 상태
  serializedLayer: string;

  // 라벨링 전후 마스킹 비교를 위한 해시값
  layerHash: string;

  // 현재 커맨드가 속한 annotation id
  annotationId: number;
};

class ToolCommand {
  toolType: Tool | -1;
  serializedLayer: string;
  layerHash: string;
  annotationId: number;

  constructor(args: ToolCommandArgs) {
    this.toolType = args.toolType;
    this.serializedLayer = args.serializedLayer;
    this.layerHash = args.layerHash;
    this.annotationId = args.annotationId;
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

type ObserverCallback = () => void;
class Observer {
  startObservers: ObserverCallback[];
  endObservers: ObserverCallback[];
  changeObservers: ObserverCallback[];
  undoRedoObservers: ObserverCallback[];

  constructor() {
    this.startObservers = [];
    this.endObservers = [];
    this.changeObservers = [];
    this.undoRedoObservers = [];
  }

  subscribeEventStart(observer: ObserverCallback) {
    this.startObservers.push(observer);
  }
  subscribeEventEnd(observer: ObserverCallback) {
    this.endObservers.push(observer);
  }
  subscribeEventChange(observer: ObserverCallback) {
    this.changeObservers.push(observer);
  }
  unsubscribeEvent(observer: ObserverCallback) {
    let idx = this.startObservers.findIndex((obs) => obs === observer);
    if (idx !== undefined) this.startObservers.splice(idx, 1);
    idx = this.endObservers.findIndex((obs) => obs === observer);
    if (idx !== undefined) this.endObservers.splice(idx, 1);
    idx = this.changeObservers.findIndex((obs) => obs === observer);
    if (idx !== undefined) this.changeObservers.splice(idx, 1);
    idx = this.undoRedoObservers.findIndex((obs) => obs === observer);
    if (idx !== undefined) this.undoRedoObservers.splice(idx, 1);
  }
  notifyObservers(observers: ObserverCallback[]) {
    observers.forEach((observer) => observer());
  }
  clearObservers() {
    this.startObservers = [];
    this.endObservers = [];
    this.changeObservers = [];
    this.undoRedoObservers = [];
  }
}

// Canvas unmount 시, 히스토리 초기화
export class AnnotationTool extends paper.Tool {
  toolType: Tool;
  isDrawing: boolean;
  static initialLayerState = '';
  static history: ToolHistory = new ToolHistory();
  // 변화가 있을 때마다, 이벤트를 감지받을 수 있도록 옵저버를 등버
  static observer = new Observer();

  constructor(toolType: Tool) {
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

  startDrawing(drawingCallback: () => void) {
    // 레이어를 편집하는 툴이 아닐 경우, 아무 것도 하지 않음
    if (!MutationTypeTool.includes(this.toolType)) return;

    // 초기 레이어 상태가 없다면 아무 것도 하지 않음
    // 초기 데이터가 로딩되기 전에 툴을 사용하면,
    // 초기 레이어 값이 바뀌니 히스토리가 꼬이게 됨
    if (AnnotationTool.initialLayerState === '') {
      return;
    }

    this.isDrawing = true;

    drawingCallback();

    // 변경 사항을 observer에게 알림
    AnnotationTool.notifyStartObservers();
  }

  endDrawing(annotationId: number) {
    // 레이어를 편집하는 툴이 아닐 경우, 아무 것도 하지 않음
    if (!MutationTypeTool.includes(this.toolType)) return;

    this.isDrawing = false;

    const { history } = AnnotationTool;

    // 복구를 위해, 마지막 편집 후의 레이어 상태를 저장
    const serializedLayer = AnnotationTool.serializeLayer();

    // 현재 레이어 상태를 해시값으로 환산
    const layerHash = AnnotationTool.getLayerHash();

    // 툴커맨드 생성
    const toolCommand = new ToolCommand({
      toolType: this.toolType,
      serializedLayer,
      layerHash,
      annotationId,
    });

    // 히스토리가 비어있으면 히스토리에 저장
    if (history.undo.length === 0) {
      history.undo.push(toolCommand);
      return;
    }

    // 상태 변경이 있을 시, 히스토리에 저장
    const lastCommand = history.undo[history.undo.length - 1];
    const lastLayerHash = lastCommand?.layerHash;

    const hasChange = layerHash !== lastLayerHash;
    if (hasChange) {
      history.undo.push(toolCommand);

      // redo 히스토리 초기화
      if (history.redo.length > 0) {
        history.redo = [];
      }
      // 변경 사항을 observer에게 알림
      AnnotationTool.notifyChangeObservers();
      AnnotationTool.notifyEndObservers();
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
    AnnotationTool.restoreLastLayer();
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
    AnnotationTool.restoreLastLayer();
  }

  static restoreLastLayer() {
    const { history } = AnnotationTool;
    const layerStateToRestore =
      history.undo.length === 0
        ? // undo 히스토리가 비어있으면 초기에 저장한 레이어 상태로 복구
          AnnotationTool.initialLayerState
        : // 마지막 상태로 캔버스를 복구
          history.undo[history.undo.length - 1]?.serializedLayer;

    paper.project.activeLayer.removeChildren();
    paper.project.activeLayer.importJSON(layerStateToRestore as string);

    // Undo, Redo시 변경이 있음으로,
    // 변경 사항을 observer에게 알림
    AnnotationTool.notifyChangeObservers();

    // Undo, Redo 발생을 알림
    AnnotationTool.notifyUndoRedoObservers();
  }

  // 이렇게 복잡한 로직이 필요한 이유는,
  // 객체 데이터가 일정하지 않기 때문 그래서
  // 순수 segment 데이터만 가지고 해시를 생성함
  static getLayerHash() {
    // 모든 CompoundPath를 가져옴
    const compoundPaths = paper.project.activeLayer.children || [];

    // 각각의 CompoundPath를 해시로 환산한 값을 배열로 저장
    const compoundPathsHashes =
      compoundPaths
        // CompoundPath만 가져옴
        .filter((item) => item instanceof paper.CompoundPath)
        // 빈 CompoundPath는 제거
        .filter((compoundPath) => compoundPath?.children?.length > 0)
        // annotationId를 기준으로 Ascending order로 정렬
        .sort(
          (a, b) =>
            Number(a.data.annotationId) - Number(b.data.annotationId) ?? 0,
        )
        // CompoundPath를 JSON으로 변환 후, 다시 수동으로 파싱하여
        // 객체로 변환(importJSON을 쓰면 paper.Item이 되어버림)
        .map((compoundPath) =>
          JSON.parse(
            compoundPath.exportJSON({
              asString: true,
            }),
          ),
        )
        .map((compoundPath: any) => {
          // 이렇게 접근하면 serialized된 Path에 접근 가능
          const [_, obj] = compoundPath;
          const children = obj.children || [];

          // Path에서 또 다시 segment 데이터만 가져옴
          const pathData = children.map((pathData: any) => {
            const [_, data] = pathData;
            return data?.segments;
          }) as [number, number][];

          // 각각의 serialized 된 CompoundPath에서 segments 데이터만
          // 추출하여 새로운 배열을 만들어 반환
          return pathData;
        })
        .filter((e) => {
          const containsUndefined = e.some((item) => item === undefined);
          return !containsUndefined;
        })
        // 순수 segment 데이터만 가지고 해시를 생성함
        .map((segments) => hash.MD5(JSON.stringify(segments))) ||
      // 현재 레이어 위에 마스킹이 없을 경우, 빈 배열을 반환
      [];

    // 결과값을 통해 레이어 해시값 생값
    const layerHash = hash.MD5(JSON.stringify(compoundPathsHashes));

    return layerHash;
  }

  static serializeLayer() {
    const clonedLayer = paper.project.activeLayer.clone();

    // 레이어 위에서 Path를 삭제함 (Raster, CompoundPath는 남겨둠)
    const clonedLayerChildren = clonedLayer.children || [];
    clonedLayerChildren.forEach((child) => {
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

  static initializeHistory() {
    // 초기 레이어 상태 저장
    if (
      AnnotationTool.history.undo.length === 0 &&
      AnnotationTool.initialLayerState === ''
    ) {
      AnnotationTool.initialLayerState = this.serializeLayer();
      console.log('initializing history');
      console.log(AnnotationTool.initialLayerState);
    }
  }

  // 현재 annotation list에 없는 command history를 삭제
  static removeCommandsWithoutAnnotationIdFromHistory(
    annotationIds: number[],
    deletedAnnotationId: number,
  ) {
    // 삭제되는 annotation id를 annotation list 에서 제거
    const targetIdx = annotationIds.findIndex(
      (id) => id === deletedAnnotationId,
    );
    annotationIds.splice(targetIdx, 1);

    // 히스토리에 있는 annotation id 목록
    const { history } = AnnotationTool;

    /**
     * ToolCommand를 정리하는 함수:
     * CommandHistory에서 annotation id가 없는 command를 삭제
     */
    const removeCommandsWithoutAnnotationId = (command: ToolCommand) => {
      const annotationId = command.annotationId;
      const isAnnotationIdExists = annotationIds.includes(annotationId);

      // annotation id가 없는 command를 삭제
      if (!isAnnotationIdExists) return false;

      // annotation id가 있는 command는 유지
      return true;
    };

    /**
     * ToolCommand에 저장 된 serializedLayer를 정리하는 함수:
     * CommandHistory의 모든 command를 순회하며,
     * serializedLayer를 다시 parse하여 CompoundPath를 객체로 변환
     * 이후, annotation id가 없는 CompoundPath를 삭제
     * 해당 객체를 가지고 다시 layerHash를 생성
     */
    const removeCompoundPathsWithoutAnnotationId = (command: ToolCommand) => {
      const { serializedLayer } = command;
      const parsedLayer = JSON.parse(serializedLayer) || {};
      const layerChildren = parsedLayer[1]?.children || [];

      // Annotation ID가 없는 CompoundPath를 삭제한 CompoundPath 목록 (json type)
      const filteredLayerChildren = layerChildren.filter(
        ([name, data]: [name: string, data: any]) => {
          // 저장할 때, Raster와 CompoundPath만 저장하므로, 해당 두가지만 유지
          if (name === 'Raster') return true;

          // CompondPath의 annotation id가 없는 경우, 삭제
          const annotationId = data?.data?.annotationId;
          const isAnnotationIdExists = annotationIds.includes(annotationId);

          if (isAnnotationIdExists) {
            return true;
          }

          // CompondPath의 annotation id가 있는 경우, 유지
          return false;
        },
      );

      // 새로운 CompoundPaths를 가지고 다시 layerHash를 생성
      const compoundPathsHashes = filteredLayerChildren
        .map(([_, data]: [_: string, data: any]) => {
          return hash.MD5(data || '');
        })
        .filter((hash: string) => hash !== '');
      const newLayerHash = hash.MD5(JSON.stringify(compoundPathsHashes));

      // 새로운 layerHash를 command에 저장
      command.layerHash = newLayerHash;

      // 새로운 CompoundPaths를 가지고 다시 serializedLayer를 생성
      parsedLayer[1].children = filteredLayerChildren;

      command.serializedLayer = JSON.stringify(parsedLayer);

      return command;
    };

    const trimHistory = (direction: ('undo' | 'redo')[]) => {
      direction.forEach((dir) => {
        history[dir] = history[dir]
          // 1. 커맨드 히스토리에서 annotation id가 없는 커맨드를 삭제
          //    (삭제 될 annotation의 데이터를 확인할 필요가 없음)
          .filter(removeCommandsWithoutAnnotationId)
          // 2. 커맨드 히스토리에서 serialized된 데이터 중, annotation id가 없는 CompoundPath를 삭제
          .map(removeCompoundPathsWithoutAnnotationId);
      });
    };

    trimHistory(['undo', 'redo']);
  }

  /*
    그림 그리시 시작,
    그림 그리시 종료,
    그리기 도구로 캔버스 데이터가 바뀌었을 때,
    Undo, Redo 발생 시,
    이벤트를 감지하는 옵저버
  */

  // 옵저버 클린업 함수
  static stopObserve(observer: () => void) {
    AnnotationTool.observer.unsubscribeEvent(observer);
  }
  static clearObservers() {
    AnnotationTool.observer.clearObservers();
  }
  // 드로잉 중인지 확인하는 옵저버
  static observerStartDrawing(observer: () => void) {
    AnnotationTool.observer.startObservers.push(observer);
  }
  static observeEndDrawing(observer: () => void) {
    AnnotationTool.observer.endObservers.push(observer);
  }
  // 툴을 통해 캔버스 데이터가 바꼈을 경우, 변경을 감지하는 옵저버
  static observeChange(observer: () => void) {
    AnnotationTool.observer.changeObservers.push(observer);
  }
  // 드로잉 시작을 알리는 옵저버
  static notifyStartObservers() {
    AnnotationTool.observer.notifyObservers(
      AnnotationTool.observer.startObservers,
    );
  }
  // 드로잉 종료를 알리는 옵저버
  static notifyEndObservers() {
    AnnotationTool.observer.notifyObservers(
      AnnotationTool.observer.endObservers,
    );
  }
  // 옵저버 상태 발생 시, 알림 함수
  static notifyChangeObservers() {
    AnnotationTool.observer.notifyObservers(
      AnnotationTool.observer.changeObservers,
    );
  }
  // Undo, Redo를 감지하는 옵저버
  static observeUndoRedo(observer: () => void) {
    AnnotationTool.observer.undoRedoObservers.push(observer);
  }
  // Undo, Redo 발생 시, 알림 함수
  static notifyUndoRedoObservers() {
    AnnotationTool.observer.notifyObservers(
      AnnotationTool.observer.undoRedoObservers,
    );
  }
}

const useTools = () => {
  const brushTool = useBrushTool();
  const boxTool = useBoxTool();
  const eraserTool = useEraserTool();
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
