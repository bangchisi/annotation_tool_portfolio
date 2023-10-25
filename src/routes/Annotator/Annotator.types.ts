// export type CategoriesType = CategoryType[];

export interface CurrentCategoryType {
  id: number;
  name: string;
  color: string;
  annotations: number[];
}

export interface CurrentAnnotationType {
  id: number;
  categoryId: number;
}

export interface CategoryType {
  categoryId: number;
  name: string;
  color: string;
  annotations: AnnotationType[];
}

export interface AnnotationType {
  annotationId: number;
  isCrowd: boolean;
  isBbox: boolean;
  color: string;
  segmentation: number[][];
  area: number;
  bbox: number[];
}

export interface ImageType {
  imageId: number;
  width: number;
  height: number;
  fileName: string;
  previousImageId: number | null;
  nextImageId: number | null;
}

export interface DataType {
  datasetId: number;
  image: ImageType;
  categories: CategoryType[];
}
