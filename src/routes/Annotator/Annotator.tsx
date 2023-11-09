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
import { useParams } from 'react-router-dom';
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

      initPaths(categories);
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
  function initPaths(categories: CategoriesType) {
    // TODO: get categories -> convert to compoundPaths -> add to canvas
    Object.entries(categories).map(([categoryId, category]) => {
      const annotations = category.annotations as {
        [key: number]: AnnotationType;
      };

      Object.entries(annotations).map(([annotationId, annotation]) => {
        // {
        //   "annotationId": 1371,
        //   "isCrowd": true,
        //   "isBbox": true,
        //   "color": "#801054",
        //   "segmentation": [],
        //   "area": 7598,
        //   "bbox": []
        // }
        const compound = getCompoundPathWithData(annotation.segmentation);
        compound.fillColor = new paper.Color(annotation.color);
        compound.strokeColor = new paper.Color(1, 1, 1, 1);
        compound.opacity = 0.5;
        const dataToAdd = {
          categoryId: categoryId,
          annotationId: annotationId,
          annotationColor: annotation.color,
        };
        compound.data = dataToAdd;
      });
    });

    console.dir('canvas compounds');
    console.dir(paper.project.activeLayer.children);
  }

  // init data
  useEffect(() => {
    initData(imageId);
  }, [dispatch]);

  useEffect(() => {
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
      <Workbench />
      <RightSidebar />
      {isLoading && (
        <LoadingSpinner message="이미지 정보를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
