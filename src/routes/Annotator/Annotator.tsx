import paper from 'paper';
import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
  setDatasetId,
  setImage,
} from './slices/annotatorSlice';
import AnnotatorModel from './models/Annotator.model';
import { useEffect, useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { AnnotationType, CategoriesType } from './Annotator.types';
import { getCompoundPathWithData } from './helpers/Annotator.helper';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

export default function Annotator() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const imageId = Number(useParams().imageId);
  // const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  const SAMEverythingLoading = useAppSelector(
    (state) => state.sam.everythingLoading,
  );

  // data 받아오기
  const initData = async (imageId: number) => {
    console.log('%cinitData', 'color: red');
    setIsLoading(true);
    try {
      const response = await AnnotatorModel.getData(imageId);
      const data = response.data;
      const { datasetId, image: imageData, categories: categoriesData } = data;

      if (!datasetId || !imageData || !categoriesData) return;

      dispatch(setCategories(categoriesData));
      dispatch(setImage(imageData));
      dispatch(setDatasetId(datasetId));

      selectFirstCategory(categoriesData);
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

    dispatch(setCurrentCategory(firstCategory));
  };

  // 기존 그림 불러오기
  function drawPaths(categories: CategoriesType) {
    console.dir(JSON.parse(JSON.stringify(categories)));
    Object.entries(categories).map(([id, category]) => {
      const categoryId = Number(id);

      const annotations = Object.entries(category.annotations) as [
        string,
        AnnotationType,
      ][];

      annotations.map(([id, annotation]) => {
        const annotationId = Number(id);
        const children = paper.project.activeLayer.children;

        // annotation이 이미 있으면 그리지 않고 스킵
        let isFound = false;
        children.forEach((child) => {
          if (
            child.data.categoryId === categoryId &&
            child.data.annotationId === annotationId
          ) {
            isFound = true;
          }
        });
        if (isFound) return;

        const compound = getCompoundPathWithData(
          annotation.segmentation,
          categoryId,
          annotationId,
          annotation.color,
        );
      });
    });
  }

  // init data
  useEffect(() => {
    initData(imageId);

    return () => {
      console.log('resetting categories');
      dispatch(setCategories({}));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!categories) return;
    if (!currentCategory || !currentAnnotation) return;
    const currentCategoryToUpdate = categories[currentCategory.categoryId];
    if (!currentCategoryToUpdate) return;
    const currentAnnotationToUpdate =
      currentCategoryToUpdate.annotations[currentAnnotation.annotationId];

    dispatch(setCurrentCategory(currentCategoryToUpdate));
    dispatch(setCurrentAnnotation(currentAnnotationToUpdate));
  }, [categories]);

  return (
    <Container>
      <LeftSidebar />
      <Workbench drawPaths={drawPaths} />
      <RightSidebar />
      {isLoading && (
        <LoadingSpinner message="이미지 정보를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
      {SAMEverythingLoading && (
        <LoadingSpinner message="SAM Everything 생성중입니다..." />
      )}
    </Container>
  );
}
