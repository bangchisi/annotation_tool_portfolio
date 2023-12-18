export interface CategoryType {
  categoryId: number;
  name: string;
  color: string;
  annotations: { [key: number]: AnnotationType };
  lastSelectedAnnotation: number;
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

export interface CategoriesType {
  [key: number]: CategoryType;
}

export interface AnnotationsType {
  [key: number]: AnnotationType;
}

export type CurrentCategoryType = CategoryType;
// export interface CurrentCategoryType {
//   id: number;
//   name: string;
//   color: string;
//   annotations: { annotationId: number; annotationColor: string }[];
// }

export type CurrentAnnotationType = AnnotationType;
// export interface CurrentAnnotationType {
//   id: number;
//   categoryId: number;
// }
