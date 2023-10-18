export type CategoriesType = CategoryType[];

export interface CategoryType {
  id: number;
  name: string;
  annotations: number[];
}

export interface AnnotationType {
  id: number;
  categoryId: number;
}
