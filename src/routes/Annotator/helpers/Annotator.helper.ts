import paper from 'paper';
import {
  AnnotationType,
  AnnotationsType,
  CategoryType,
  CurrentCategoryType,
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

// export function toCurrentCategory(category: CategoryType): CurrentCategoryType {
//   const currentCategory = {
//     id: category.categoryId,
//     name: category.name,
//     color: category.color,
//     annotations: toCurrentCategoryAnnotations(category.annotations),
//     // annotations: annotationsToIds(category.annotations),
//   };

//   return currentCategory;
// }

// export function getLastAnnotationIdByCategoryId(
//   category: CategoryType,
// ): number {
//   if (category.annotations.length > 0) {
//     const maxIdObject = category.annotations.reduce((max, current) => {
//       return current.annotationId > max.annotationId ? current : max;
//     });
//     return maxIdObject.annotationId;
//   }

//   return -1;
// }

//------------ init data
// set data in compoundPath
export function getCompoundPathWithData(
  segmentation: number[][],
  categoryId: number,
  annotationId: number,
) {
  const compoundPath = segmentationToCompoundPath(segmentation);
  compoundPath.data = { categoryId, annotationId };

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
  const path = points.map((point: number, idx) => {
    if (idx % 2 === 0) {
      return [point, points[idx + 1]];
    }
  });

  // path를 segments로 하는 pape.Path를 만들어 return
  return new paper.Path({
    segments: path,
    closed: true,
  });
}

//---------- save data
// paper.Path: { .., segments: [number, number][], ...} -> points: number[]
export function pathToPoints(path: paper.Path) {
  const points: number[] = [];

  const segments = path.segments; // [ Segment, Segment, ...]

  segments.map((segment) => {
    points.push(segment.point.x);
    points.push(segment.point.y);
  });

  return points;
}

// paper.CompoundPath: { .., children: paper.Path[], ..} -> segmentation: number[][]
export function compoundPathToSegmentation(compoundPath: paper.CompoundPath) {
  const children = compoundPath.children;
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
    bbox: getBbox(compound),
  };
}

// get bbox or not: boolean
function getIsBbox(compound: paper.CompoundPath) {
  return true;
}

// get crowded or not: boolean
function getIsCrowd(compound: paper.CompoundPath) {
  return true;
}

// get bbox
function getBbox(compound: paper.CompoundPath) {
  const group = new paper.Group(compound.children);
  const box = new paper.Path.Rectangle(group);

  // return box.bounds;
  return [];
}
