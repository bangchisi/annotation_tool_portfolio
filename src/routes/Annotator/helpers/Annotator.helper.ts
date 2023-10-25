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
