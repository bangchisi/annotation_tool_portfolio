import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  setCategories,
  setCurrentCategory,
  setDatasetId,
  setImage,
} from './slices/annotatorSlice';
import AnnotatorModel from './models/Annotator.model';
import { useEffect, useState } from 'react';
import PathStore from './utils/PathStore';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useParams } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { CategoriesType, CategoryType } from './Annotator.types';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// path 정보들을 저장한 배열
// export let paths: PathStore;
// export const paths = new PathStore();

export default function Annotator() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const imageId = Number(useParams().imageId);
  // // const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );

  // data 받아오기
  const initData = async (imageId: number) => {
    try {
      setIsLoading(true);
      const response = await AnnotatorModel.getData(imageId);
      const data = response.data;
      const { datasetId, image: imageData, categories: categoriesData } = data;

      if (!datasetId || !imageData) return;

      dispatch(setDatasetId(datasetId));
      dispatch(setImage(imageData));
      dispatch(setCategories(categoriesData));

      selectFirstCategory(categoriesData);
      // initPaths(categories);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get annotator data');
    } finally {
      setIsLoading(false);
    }
  };

  const selectFirstCategory = (categories: CategoriesType) => {
    const keys = Object.keys(categories);
    if (keys.length <= 0) return;

    const firstCategory = categories[Number(keys[0])];

    // const currentCategory = toCurrentCategory(firstCategory);

    dispatch(setCurrentCategory(firstCategory));
  };

  // 기존 그림 불러오기
  // const initPaths = (categories: Map<number, CategoryType>) => {
  //   // TODO: get categories -> convert to compoundPaths -> add to canvas
  //   const paths = [];
  //   for (const category of categories.values()) {
  //     for (const annotation of category.annotations.values()) {
  //       const pathToPush = {
  //         categoryId: category.categoryId,
  //         annotationId: annotation.annotationId,
  //         segmentations: annotation.segmentation || [],
  //       };

  //       paths.push(pathToPush);
  //     }
  //   }

  //   return paths;
  // };

  // init data
  useEffect(() => {
    initData(imageId);
  }, [dispatch]);

  useEffect(() => {
    if (!currentAnnotation || !currentCategory) return;
  }, [categories]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
      {isLoading && (
        <LoadingSpinner message="이미지 정보를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
