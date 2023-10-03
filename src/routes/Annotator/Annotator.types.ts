export interface CategoryType {
  id: number;
  name: string;
  annotations: AnnotationType[];
}

export interface AnnotationType {
  id?: number;
  categoryId?: number;
  path?: paper.CompoundPath | paper.PathItem | null;
}

export type CategoriesType = CategoryType[];
