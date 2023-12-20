import paper from 'paper';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from 'App.hooks';
import {
  selectAnnotator,
  setCategories,
  setCurrentCategoryByCategoryId,
  setDatasetId,
  setImage,
} from '../slices/annotatorSlice';

import AnnotatorModel from '../models/Annotator.model';

import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { AnnotationType, CategoriesType } from '../Annotator.types';

const useReloadAnnotator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { categories, currentCategory, currentAnnotation, image } =
    useAppSelector(selectAnnotator);

  const initData = async (imageId: number) => {
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

    const firstCategoryId = Number(keys[0]);

    dispatch(setCurrentCategoryByCategoryId(firstCategoryId));
  };

  const drawPaths = (categories: CategoriesType): void => {
    const existingAnnotations = new Set();
    paper.project.activeLayer.children.forEach((child) => {
      existingAnnotations.add(
        `${child.data.categoryId}-${child.data.annotationId}`,
      );
    });

    Object.entries(categories ?? {}).forEach(([id, category]) => {
      const categoryId = Number(id);
      const annotations = Object.values<AnnotationType>(category.annotations);

      annotations.forEach((annotation) => {
        const { annotationId } = annotation;

        if (existingAnnotations.has(`${categoryId}-${annotationId}`)) return;

        getCompoundPathWithData(
          annotation.segmentation,
          categoryId,
          annotationId,
          annotation.color,
        );
      });
    });
  };

  // set data in compoundPath
  const getCompoundPathWithData = (
    segmentation: number[][],
    categoryId: number,
    annotationId: number,
    annotationColor: string,
  ) => {
    const compoundPath = segmentationToCompoundPath(segmentation);
    compoundPath.data = { categoryId, annotationId, annotationColor };
    compoundPath.fillColor = new paper.Color(annotationColor);
    compoundPath.strokeColor = new paper.Color(1, 1, 1, 1);
    compoundPath.opacity = 0.5;

    return compoundPath;
  };

  // segmentation -> paper.CompoundPath
  const segmentationToCompoundPath = (segmentation: number[][]) => {
    const compoundPath = new paper.CompoundPath({});

    segmentation.map((points: number[]) => {
      compoundPath.addChild(pointsToPath(points));
    });

    return compoundPath;
  };

  // points: number[] -> paper.Path
  const pointsToPath = (points: number[]) => {
    // number[] -> [number, number][]
    const raster = paper.project.activeLayer.children[0] as paper.Raster;
    const { x, y } = raster.bounds.topLeft;

    const path = points
      .map((point: number, idx) => {
        if (idx % 2 === 0) {
          return [point + x, points[idx + 1] + y];
        }
      })
      .filter((point) => point !== undefined);

    // path를 segments로 하는 pape.Path를 만들어 return
    return new paper.Path({
      segments: path,
      closed: true,
    });
  };

  // clear canvas except image
  const clearCanvas = () => {
    const childrenToRemove = paper.project.activeLayer.children.filter(
      (child) => child.className !== 'Raster',
    );

    childrenToRemove.forEach((child) => {
      child.remove();
    });
  };

  return {
    categories,
    currentCategory,
    currentAnnotation,
    image,
    isLoading,
    setIsLoading,
    initData,
    drawPaths,
    clearCanvas,
  };
};

export default useReloadAnnotator;
