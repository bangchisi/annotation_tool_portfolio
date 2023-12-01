import paper from 'paper';
import {
  AnnotationType,
  AnnotationsType,
  CategoryType,
} from '../Annotator.types';

export function setCategory(
  id: number,
  name: string,
  annotations: AnnotationType[],
): CategoryType {
  const category = {
    id,
    name,
    annotations,
  };

  // for serializing
  return JSON.parse(JSON.stringify(category));
}

export function setAnnotation(
  id?: number,
  categoryName?: string,
  path?: paper.CompoundPath | paper.PathItem | null,
): AnnotationType {
  const annotation = {
    id,
    categoryName,
    path,
  };

  // for serializing
  return JSON.parse(JSON.stringify(annotation));
}

export function annotationsToIds(annotations: AnnotationsType): number[] {
  const ids: number[] = [];

  Object.entries(annotations).map(([annotationId]) => {
    const id = Number(annotationId);
    ids.push(id);
  });

  return ids;
}

export function toCurrentCategoryAnnotations(annotations: AnnotationsType) {
  const annotationList: { annotationId: number; annotationColor: string }[] =
    [];
  Object.entries(annotations).map(([annotationId, annotation]) => {
    annotationList.push({
      annotationId: Number(annotationId),
      annotationColor: annotation.color,
    });
  });

  return annotationList;
}

//------------ init data
// set data in compoundPath
export function getCompoundPathWithData(
  segmentation: number[][],
  categoryId: number,
  annotationId: number,
  annotationColor: string,
) {
  const compoundPath = segmentationToCompoundPath(segmentation);
  compoundPath.data = { categoryId, annotationId, annotationColor };
  compoundPath.fillColor = new paper.Color(annotationColor);
  compoundPath.strokeColor = new paper.Color(1, 1, 1, 1);
  compoundPath.opacity = 0.5;

  return compoundPath;
}

// segmentation -> paper.CompoundPath
export function segmentationToCompoundPath(segmentation: number[][]) {
  const compoundPath = new paper.CompoundPath({});

  segmentation.map((points: number[]) => {
    compoundPath.addChild(pointsToPath(points));
  });

  return compoundPath;
}

// points: number[] -> paper.Path
export function pointsToPath(points: number[]) {
  // number[] -> [number, number][]
  const raster = paper.project.activeLayer.children[0] as paper.Raster;
  const { x, y } = raster.bounds.topLeft;

  const path = points
    .map((point: number, idx) => {
      if (idx % 2 === 0) {
        return [point + x, points[idx + 1] + y];
      }
    })
    .filter((point) => point !== undefined);

  // path를 segments로 하는 pape.Path를 만들어 return
  return new paper.Path({
    segments: path,
    closed: true,
  });
}

//---------- save data
// pathToPoints -> compoundPathToSegmentation -> getConvertedAnnotation
// paper.Path: { .., segments: [number, number][], ...} -> points: number[]
export function pathToPoints(path: paper.Path) {
  const points: number[] = [];
  const raster = paper.project.activeLayer.children[0] as paper.Raster;
  const { x, y } = raster.bounds.topLeft;

  const segments = path.segments; // [ Segment, Segment, ...]

  segments.forEach((segment) => {
    points.push(Math.round((segment.point.x - x) * 100) / 100);
    points.push(Math.round((segment.point.y - y) * 100) / 100);
  });

  return points;
}

// paper.CompoundPath: { .., children: paper.Path[], ..} -> segmentation: number[][]
export function compoundPathToSegmentation(compoundPath: paper.CompoundPath) {
  const { children } = compoundPath;

  const segmentation: number[][] = [];

  // Path to points
  children.map((child) => {
    segmentation.push(pathToPoints(child as paper.Path));
  });

  return segmentation;
}

// set data with segmentation
export function getConvertedAnnotation(compound: paper.CompoundPath) {
  const { annotationId, annotationColor } = compound.data;

  return {
    annotation_id: annotationId,
    // isBbox() 구현이나 bbox인지 확인하는 방법 생각.
    // 사용했던 tool을 기록해서 box tool 요소 단 한개만 있으면 bbox겠지?
    isbbox: getIsBbox(compound),
    // iscrowd 역시 isbbox와 같이 고민.
    iscrowd: getIsCrowd(compound),
    color: annotationColor,
    segmentation: compoundPathToSegmentation(compound),
    area: Math.round(compound.area),
    // new Group(compound.children)을 Path.Rectangle().bounds 해야하나 알아보기.
    bbox: getBbox(compound, annotationId),
  };
}

// get bbox or not: boolean
function getIsBbox(compound: paper.CompoundPath) {
  return false;
}

// get crowded or not: boolean
function getIsCrowd(compound: paper.CompoundPath) {
  return true;
}

// get bbox
function getBbox(compound: paper.CompoundPath, annotationId: number) {
  // FIX: compound가 이전 상태를 가리킴. 현재 상태로 바꿔야함
  const group =
    compound.children
      .slice(1)
      .filter((child) => annotationId === child.data.annotationId) || [];
  const bbox = new paper.Path.Rectangle(group);

  return [
    bbox.bounds.topLeft.x,
    bbox.bounds.topLeft.y,
    bbox.bounds.width,
    bbox.bounds.height,
  ];
}
