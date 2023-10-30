import {
  AnnotationType,
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

export function annotationsToIds(annotations: AnnotationType[]): number[] {
  if (annotations.length <= 0) return [];
  const ids = annotations.map((annotation) => annotation.annotationId);

  return ids;
}

export function toCurrentCategory(category: CategoryType): CurrentCategoryType {
  const currentCategory = {
    id: category.categoryId,
    name: category.name,
    color: category.color,
    annotations: annotationsToIds(category.annotations),
  };

  return currentCategory;
}

export function getLastAnnotationIdByCategoryId(
  category: CategoryType,
): number {
  if (category.annotations.length > 0) {
    const maxIdObject = category.annotations.reduce((max, current) => {
      return current.annotationId > max.annotationId ? current : max;
    });
    return maxIdObject.annotationId;
  }

  return -1;
}

// set data in compoundPath
function getCompoundPathWithData(
  segmentation: number[][],
  categoryId: number,
  annotationId: number,
) {
  const compoundPath = segmentationToCompoundPath(segmentation);
  compoundPath.data = { categoryId, annotationId };

  return compoundPath;
}

// segmentation -> paper.CompoundPath
function segmentationToCompoundPath(segmentation: number[][]) {
  const compoundPath = new paper.CompoundPath({});

  segmentation.map((points: number[]) => {
    compoundPath.addChild(pointsToPath(points));
  });

  return compoundPath;
}

// points: number[] -> paper.Path
function pointsToPath(points: number[]) {
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
