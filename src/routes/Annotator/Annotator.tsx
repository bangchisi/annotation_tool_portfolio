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
import PathStore, { PathType } from './utils/PathStore';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useParams } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { toCurrentCategory } from './helpers/Annotator.helper';
import { CategoryType } from './Annotator.types';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// path 정보들을 저장한 배열
// export let paths: PathStore;
export const paths = new PathStore();

export default function Annotator() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const imageId = Number(useParams().imageId);
  // // const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const categories = useAppSelector((state) => state.annotator.categories);
  // const currentCategory = useAppSelector(
  //   (state) => state.annotator.currentCategory,
  // );

  const initData = async (imageId: number) => {
    try {
      setIsLoading(true);
      const response = await AnnotatorModel.getData(imageId);
      const data = response.data.data;
      const { datasetId, image, categories } = data;

      if (!datasetId || !image) return;

      dispatch(setDatasetId(datasetId));
      dispatch(setImage(image));
      dispatch(setCategories(categories));
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get annotator data');
    } finally {
      setIsLoading(false);
    }
  };

  const initPaths = (categories: CategoryType[]) => {
    const paths = categories.map((category) => {
      category.annotations.map((annotation) => {
        return {
          categoryId: category.categoryId,
          annotationId: annotation.annotationId,
          segmentations: annotation.segmentation || [],
        };
      });
    });

    return paths;
  };

  // init data
  useEffect(() => {
    initData(imageId);
  }, [dispatch]);

  // update current category, when categories changed.
  useEffect(() => {
    if (categories.length <= 0) return;

    const currentCategory = toCurrentCategory(categories[0]);

    dispatch(setCurrentCategory(currentCategory));

    initPaths(categories);
  }, [categories]);

  // init paths
  // useEffect(() => {
  //   // categories 가져오는 async 함수
  //   async function fetchCategories() {
  //     try {
  //       const newCategories = await AnnotatorModel.getCategories(0, 0);
  //       // 받아온 정보로 categories init
  //       dispatch(setCategories(newCategories));

  //       // 받아온 categories 내용이 있으면
  //       if (newCategories.length > 0) {
  //         // 0번째 category를 currentCategory로
  //         dispatch(setCurrentCategory(newCategories[0]));
  //       }
  //     } catch (error) {
  //       console.error('Error init categories:', error);
  //     }
  //   }

  //   async function fetchPaths() {
  //     const pathArray = await AnnotatorModel.getPaths();
  //     paths = new PathStore(pathArray);
  //   }

  //   if (categories.length === 0) {
  //     // categories가 비어있을 때만 데이터를 가져옴
  //     fetchCategories();
  //     fetchPaths();
  //   }
  // }, [dispatch]);

  // // currentCategory 변경 -> categories 갱신
  // useEffect(() => {
  // }, [currentCategory, dispatch]);

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
