import { AnnotationType, CategoryType } from '../Annotator.types';

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
