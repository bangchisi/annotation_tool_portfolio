// 카테고리 타입 정의
export interface CategoryType {
  categoryId: number; // 카테고리 id
  name: string; // 카테고리 이름
  color: string; // 카테고리 색상
  annotations: { [key: number]: AnnotationType }; // 카테고리에 속한 어노테이션들
  lastSelectedAnnotation: number; // 마지막으로 선택된 어노테이션
}

// 어노테이션 타입 정의
export interface AnnotationType {
  annotationId: number; // 어노테이션 id
  isCrowd: boolean; // 겹친 어노테이션인지 여부
  isBbox: boolean; // bbox인지 여부
  color: string; // 어노테이션 색상
  segmentation: number[][]; // 어노테이션의 segmentation 좌표
  area: number; // 어노테이션의 면적
  bbox: number[]; // 어노테이션의 bbox 좌표
}

// 이미지 타입 정의
export interface ImageType {
  imageId: number; // 이미지 id
  width: number; // 이미지 너비
  height: number; // 이미지 높이
  fileName: string; // 이미지 파일 이름
  previousImageId: number | null; // 이전 이미지 id
  nextImageId: number | null; // 다음 이미지 id
}

// 사용하지 않는 타입.
export interface DataType {
  datasetId: number;
  image: ImageType;
  categories: CategoryType[];
}

// 카테고리 목록 타입 정의
export interface CategoriesType {
  [key: number]: CategoryType; // 카테고리 id를 key로 하는 카테고리 객체
}

// 어노테이션 목록 타입 정의
export interface AnnotationsType {
  [key: number]: AnnotationType; // 어노테이션 id를 key로 하는 어노테이션 객체
}

// 현재 선택된 카테고리 타입 정의
export type CurrentCategoryType = CategoryType;
// export interface CurrentCategoryType {
//   id: number;
//   name: string;
//   color: string;
//   annotations: { annotationId: number; annotationColor: string }[];
// }

// 현재 선택된 어노테이션 타입 정의
export type CurrentAnnotationType = AnnotationType;
// export interface CurrentAnnotationType {
//   id: number;
//   categoryId: number;
// }
