import paper from 'paper';
import { AddButton, Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';
import { Annotation } from './Annotation/Annotation';
import { PathType } from 'routes/Annotator/utils/PathStore';
import {
  AnnotationType,
  CategoriesType,
  CategoryType,
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
  updateCategories,
} from 'routes/Annotator/slices/annotatorSlice';
import {
  annotationsToIds,
  toCurrentCategory,
  toCurrentCategoryAnnotations,
} from 'routes/Annotator/helpers/Annotator.helper';
import { getRandomHexColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { canvasData } from 'routes/Annotator/components/Workbench/Canvas/Canvas';

export default function AnnotationList() {
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const dispatch = useAppDispatch();

  // empty annotation 생성
  function createEmptyAnnotation() {
    // 항목 2. categories 업데이트
    if (!categories || !currentCategory) return;

    const category = getCurrentCategoryData(categories, currentCategory);
    // console.dir('category');
    // console.dir(category);

    if (!category) return;
    // 새로 생성할 annotation id
    const nextId = getLastAnnotationIdByCategory(category) + 1;

    // categories 업데이트. 특정 category 바꿔치기.
    updateSelectedCategory(category, nextId);

    // 항목 1. paper 업데이트
    const compoundPathToAdd = new paper.CompoundPath({});
    const annotationColor = getRandomHexColor();
    // console.log(annotationColor);
    compoundPathToAdd.fillColor = new paper.Color(annotationColor);
    compoundPathToAdd.strokeColor = new paper.Color(1, 1, 1, 1);
    compoundPathToAdd.opacity = 0.5;

    const dataToAdd = {
      categoryId: currentCategory.id,
      annotationId: nextId,
      annotationColor: annotationColor,
    };
    // console.dir('dataToAdd');
    // console.dir(dataToAdd);
    compoundPathToAdd.data = dataToAdd;

    // 항목 3. currentAnnotation 업데이트
    const currentAnnotationToUpdate = {
      id: nextId,
      categoryId: currentCategory.id,
    };
    dispatch(setCurrentAnnotation(currentAnnotationToUpdate));
  }

  // last annotationId를 구하는 함수
  function getLastAnnotationIdByCategory(category: CategoryType): number {
    const annotations = category.annotations;
    if (Object.keys(annotations).length > 0) {
      let maxId = -1;

      Object.entries(annotations).map(([annotationId]) => {
        const id = Number(annotationId);
        if (id > maxId) {
          maxId = id;
        }
      });

      return maxId;
    }

    return -1;
  }

  // categoryId를 이용해 나머지 정보를 가져오는 함수
  function getCurrentCategoryData(
    categories: CategoriesType,
    currentCategory: CurrentCategoryType,
  ) {
    const category = categories[currentCategory.id];

    return category;
  }

  // categoriesToUpdate 생성하는 함수
  function updateSelectedCategory(
    category: CategoryType,
    newAnnotationId: number,
  ) {
    // 업데이트할 category 가져옴. 복사.
    const categoryToUpdate = copyObject(category);
    // console.log('before');
    // console.dir(categoryToUpdate);
    if (!categoryToUpdate) return;

    // 새 annotation 객체 생성
    const newAnnotation = {
      annotationId: newAnnotationId,
      isCrowd: false,
      isBbox: false,
      color: categoryToUpdate.color,
      segmentation: [],
      area: 0,
      bbox: [],
    };

    // category에 새 annotation 추가
    // categoryToUpdate.annotations.set(newAnnotationId, newAnnotation);
    categoryToUpdate.annotations[newAnnotationId] = newAnnotation;

    // console.log('after push');
    // console.dir(categoryToUpdate);

    // categories에 category 반영
    dispatch(updateCategories(categoryToUpdate));

    // currentCategory에 반영
    dispatch(setCurrentCategory(toCurrentCategory(categoryToUpdate)));
  }

  function copyObject(object: unknown) {
    return JSON.parse(JSON.stringify(object));
  }

  // annotation 선택
  function selectAnnotation(categoryId: number, annotationId: number) {
    {
      // TODO: make paths.tempPath to selectedAnnotation path
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

    const selectedCurrentCategory = {
      id: selectedCategory.categoryId,
      name: selectedCategory.name,
      color: selectedCategory.color,
      annotations: toCurrentCategoryAnnotations(selectedCategory.annotations),
      // annotations: annotationsToIds(selectedCategory.annotations),
    };
    dispatch(setCurrentCategory(selectedCurrentCategory));

    const selectedCurrentAnnotation: CurrentAnnotationType = {
      categoryId: selectedCategory.categoryId,
      id: annotationId,
    };
    dispatch(setCurrentAnnotation(selectedCurrentAnnotation));
  }

  return (
    <Container>
      <AddButton
        functionName="Add annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createEmptyAnnotation}
        placement="left"
        isFunction={true}
      />
      {currentCategory &&
        currentCategory.annotations.map((annotation) => (
          <Annotation
            key={annotation.annotationId}
            categoryId={currentCategory.id}
            categoryColor={currentCategory.color}
            annotationId={annotation.annotationId}
            annotationColor={annotation.annotationColor}
            onClick={selectAnnotation}
          />
        ))}
      {/* {currentCategory?.annotations.map((annotationId) => (
        <Annotation
          key={annotationId}
          categoryId={currentCategory.id}
          categoryColor={currentCategory.color}
          annotationId={annotationId}
          onClick={selectAnnotation}
        />
      ))} */}
      <Annotation
        key={1}
        categoryId={0}
        categoryColor={'#ff120f'}
        annotationColor={'#9fa9c1'}
        annotationId={0}
        onClick={selectAnnotation}
      />
    </Container>
  );
}
