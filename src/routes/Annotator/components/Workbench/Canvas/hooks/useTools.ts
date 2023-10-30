import paper from 'paper';
import { Tool, paths } from 'routes/Annotator/Annotator';
import { onSelectMouseDown, onSelectMouseDrag } from '../tools/SelectTool';
import {
  onBrushMouseDown,
  onBrushMouseDrag,
  onBrushMouseMove,
  onBrushMouseUp,
} from '../tools/BrushTool';
import { onBoxMouseDown, onBoxMouseUp, onBoxMouseMove } from '../tools/BoxTool';
import {
  CurrentCategoryType,
  CurrentAnnotationType,
} from 'routes/Annotator/Annotator.types';
// import { useAppDispatch } from 'App.hooks';
import { onEraserMouseDrag, onEraserMouseMove } from '../tools/EraserTool';
import PathStore from 'routes/Annotator/utils/PathStore';

interface UseToolsProps {
  initPoint: paper.Point | null;
  selectedTool: Tool;
  onChangePoint: (point: paper.Point) => void;
  currentAnnotation?: CurrentAnnotationType;
  currentCategory?: CurrentCategoryType;
  // containerWidth: number | null;
  // containerHeight: number | null;
}

export const useTools = (props: UseToolsProps) => {
  const {
    selectedTool,
    onChangePoint,
    initPoint,
    currentAnnotation,
    currentCategory,
    // containerWidth,
    // containerHeight,
  } = props;

  let pathToAdd;

  // const dispatch = useAppDispatch();
  // 마우스 커서 움직임
  const onMouseMove = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseMove(event);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseMove(event);
    } else if (selectedTool === Tool.Eraser) {
      onEraserMouseMove(event);
    }
  };

  // 마우스 클릭
  const onMouseDown = (event: paper.MouseEvent) => {
    onChangePoint(event.point);
    if (selectedTool === Tool.Select) {
      onSelectMouseDown(event);
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseDown(event, currentCategory);
    } else if (selectedTool === Tool.Box) {
      onBoxMouseDown(event);
    }
  };

  // 마우스 클릭 해제
  const onMouseUp = (event: paper.MouseEvent) => {
    // console.log(event);
    if (selectedTool === Tool.Select) {
      // ...
    } else if (selectedTool === Tool.Brush) {
      pathToAdd = onBrushMouseUp(currentCategory, currentAnnotation);

      console.log('pathToAdd: ');
      console.dir(pathToAdd);
      if (pathToAdd) {
        const segmentations = PathStore.compoundPathToSegmentation(pathToAdd);
        if (!currentCategory || !currentAnnotation || !segmentations) return;

        // paths.appendPath를 그냥 push가 아니라 categoryId, annotationId 조회해서 있으면 업데이트, 없으면 추가 해야함
        // 이걸 위해서는 key가 존재하면 덮어쓰고 없으면 새로 넣는 map 형식이 좋을듯?
        paths.appendPath({
          categoryId: currentCategory?.id,
          annotationId: currentAnnotation?.id,
          segmentations: segmentations,
        });
        console.dir(paths.paths);
      }
    } else if (selectedTool === Tool.Box) {
      pathToAdd = onBoxMouseUp(event, currentCategory, currentAnnotation);

      console.log('pathToAdd: ');
      console.dir(pathToAdd);
      if (pathToAdd) {
        const segmentations = PathStore.compoundPathToSegmentation(pathToAdd);
        if (!currentCategory || !currentAnnotation || !segmentations) return;
        paths.appendPath({
          categoryId: currentCategory?.id,
          annotationId: currentAnnotation?.id,
          segmentations: segmentations,
        });
        console.dir(paths.paths);
      }
    }
  };

  // 마우스 드래그
  const onMouseDrag = (event: paper.MouseEvent) => {
    if (selectedTool === Tool.Select) {
      // 이미지 드래그해서 옮기기
      onSelectMouseDrag(event, initPoint);
    } else if (selectedTool === Tool.Brush) {
      onBrushMouseDrag(event, currentCategory);
    } else if (selectedTool === Tool.Eraser) {
      onEraserMouseDrag(event, currentCategory, currentAnnotation);
    }
  };

  return { onMouseMove, onMouseDown, onMouseUp, onMouseDrag };
};

// tempPath -> segments 변환
export function tempPathToSegmentation(segments: paper.Segment[]): number[] {
  const segmentation: number[] = [];
  segments.map((segment) => {
    segmentation.push(segment.point.x);
    segmentation.push(segment.point.y);
  });

  return segmentation;
}

// const onToolsMouseMove = (
//   event: paper.MouseEvent,
//   onChangePoint: (point: paper.Point) => void,
//   // containerWidth: number | null,
//   // containerHeight: number | null,
// ) => {
//   const { point } = event;
//   // let tempPoint: paper.Point | null = null;

//   // if (containerWidth && containerHeight) {
//   //   const containerPoint = new paper.Point(
//   //     containerWidth / 2,
//   //     containerHeight / 2,
//   //   );

//   //   // 이미지 가운데가 (0, 0)인 좌표로 변환
//   //   tempPoint = point.subtract(containerPoint);
//   //   onChangePoint(tempPoint);
//   //   // console.log('SelectTool.ts, onSelectMouseMove, tempPoint: ', tempPoint);
//   // } else {
//   //   // 그냥 그대로, 혹시 모르니
//   //   onChangePoint(point);
//   // }
//   onChangePoint(point);
// };
