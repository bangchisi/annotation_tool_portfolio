import paper from 'paper';
import { AddButton, Container, DeleteAllButton } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Annotation } from './Annotation/Annotation';
import {
  AnnotationType,
  CategoriesType,
  CategoryType,
  CurrentAnnotationType,
} from 'routes/Annotator/Annotator.types';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
  updateCategories,
  selectAnnotator,
} from 'routes/Annotator/slices/annotatorSlice';
import { getRandomHexColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { canvasData } from 'routes/Annotator/components/Workbench/Canvas/Canvas';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export default function AnnotationList() {
  const [isLoading, setIsLoading] = useState(false);
  const { categories, currentCategory } = useAppSelector(selectAnnotator);
  const dispatch = useAppDispatch();
  const imageId = Number(useParams().imageId);
  const datasetId = useAppSelector((state) => state.annotator.datasetId);

  // empty annotation 생성
  async function createEmptyAnnotation() {
    // 항목 2. categories 업데이트
    if (!imageId || !datasetId || !categories || !currentCategory) return;

    // 랜덤 색상 생성
    const annotationColor = getRandomHexColor();

    setIsLoading(true);
    try {
      // 빈 annotation 껍데기 생성 요청
      const response = await AnnotatorModel.createAnnotation(
        imageId,
        datasetId,
        currentCategory.categoryId,
        annotationColor,
      );

      // 서버에서 생성한 마지막 annotation id
      const nextAnnotationId = response.data.annotationId;

      // 새 annotation 생성, default 값들임.
      const newAnnotation = {
        annotationId: nextAnnotationId,
        isCrowd: false,
        isBbox: false,
        color: annotationColor,
        segmentation: [[]],
        area: 0,
        bbox: [0, 0, 0, 0],
      };

      // categories 업데이트. 특정 category 바꿔치기.
      updateSelectedCategory(currentCategory, newAnnotation);

      // 항목 1. paper 업데이트
      const compoundPathToAdd = new paper.CompoundPath({});
      compoundPathToAdd.fillColor = new paper.Color(annotationColor);
      compoundPathToAdd.strokeColor = new paper.Color(1, 1, 1, 1);
      compoundPathToAdd.opacity = 0.825;
      const dataToAdd = {
        categoryId: currentCategory.categoryId,
        annotationId: nextAnnotationId,
        annotationColor: annotationColor,
      };
      compoundPathToAdd.data = dataToAdd;

      // 항목 3. currentAnnotation 업데이트
      dispatch(setCurrentAnnotation(newAnnotation));
      console.log('%cnewAnnotation', 'color: red');
      console.dir(paper.project.activeLayer.children.length);
      console.dir(paper.project.activeLayer.children);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create annotation');
      alert('annotation 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAllAnnotations(imageId: number, categoryId: number) {
    try {
      const response = await AnnotatorModel.deleteAllAnnotations(
        imageId,
        categoryId,
      );
      if (response.status !== 200)
        throw new Error('Failed to delete all annotations');
      deleteAllAnnotationInCategories(categoryId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete all annotations');
    }
  }

  // categoriesToUpdate 생성하는 함수
  function updateSelectedCategory(
    category: CategoryType,
    newAnnotation: AnnotationType,
  ) {
    // 업데이트할 category 가져옴. 복사.
    const categoryToUpdate = copyObject(category);
    // console.log('before');
    // console.dir(categoryToUpdate);
    if (!categoryToUpdate) return;

    // category에 새 annotation 추가
    categoryToUpdate.annotations[newAnnotation.annotationId] = newAnnotation;

    // categories에 category 반영
    dispatch(updateCategories(categoryToUpdate));

    // currentCategory에 반영
    dispatch(setCurrentCategory(categoryToUpdate));
  }

  function copyObject(object: unknown) {
    return JSON.parse(JSON.stringify(object));
  }

  // annotation 선택
  function selectAnnotation(categoryId: number, annotationId: number) {
    {
      // TODO: make paths.tempPath to selectedAnnotation path
      console.log('selectAnnotation');
      const selectedPath = paper.project.activeLayer.children.find(
        (path) =>
          path.data.categoryId === categoryId &&
          path.data.annotationId === annotationId,
      ) as paper.CompoundPath;

      canvasData.tempPath = selectedPath;
      // console.dir(selectedPath);
    }

    // console.log(`select annotation. (${categoryId}, ${annotationId})`);
    if (!categories) return;

    const selectedCategory = categories[categoryId];
    // categories.find(
    //   (category) => category.categoryId === categoryId,
    // );

    if (!selectedCategory) return;

    dispatch(setCurrentCategory(selectedCategory));

    const selectedCurrentAnnotation: CurrentAnnotationType =
      selectedCategory.annotations[annotationId];
    dispatch(setCurrentAnnotation(selectedCurrentAnnotation));
  }

  function deleteAnnotationInCategories(annotationId: number) {
    if (!categories || !currentCategory) return;

    const categoriesToUpdate = JSON.parse(JSON.stringify(categories));

    delete categoriesToUpdate[`${currentCategory.categoryId}`]['annotations'][
      `${annotationId}`
    ];

    dispatch(setCategories(categoriesToUpdate));
  }

  function deleteAllAnnotationInCategories(categoryId: number) {
    if (!categories) return;

    const categoriesToUpdate = JSON.parse(
      JSON.stringify(categories),
    ) as CategoriesType;

    categoriesToUpdate[categoryId].annotations = {} as {
      [key: string]: AnnotationType;
    };

    dispatch(setCategories(categoriesToUpdate));
  }

  return (
    <Container>
      {isLoading && <LoadingSpinner message="annotation 목록 갱신 중입니다." />}
      <AddButton
        functionName="Add Annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createEmptyAnnotation}
        placement="left"
        isFunction={true}
      />
      <DeleteAllButton
        functionName="Delete All"
        iconComponent={<DeleteSweepOutlinedIcon />}
        handleClick={() => {
          // ...
          if (!currentCategory) return;
          confirm('모두 삭제 하시겠습니까?')
            ? deleteAllAnnotations(imageId, currentCategory.categoryId)
            : () => false;
        }}
        placement="left"
        isFunction={true}
      />
      {currentCategory &&
        Object.entries(currentCategory.annotations).map(
          ([annotationId, annotation]) => (
            <Annotation
              key={annotation.annotationId}
              categoryId={currentCategory.categoryId}
              categoryColor={currentCategory.color}
              annotationId={Number(annotationId)}
              annotationColor={annotation.color}
              onClick={selectAnnotation}
              setIsLoading={setIsLoading}
              deleteAnnotationInCategories={deleteAnnotationInCategories}
            />
          ),
        )}
    </Container>
  );
}
