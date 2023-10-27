import paper from 'paper';
import { AddButton, Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';
import { Annotation } from './Annotation/Annotation';
import { paths } from 'routes/Annotator/Annotator';
import { PathType } from 'routes/Annotator/utils/PathStore';
import {
  AnnotationType,
  CategoryType,
  CurrentAnnotationType,
  CurrentCategoryType,
} from 'routes/Annotator/Annotator.types';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
} from 'routes/Annotator/slices/annotatorSlice';
import { annotationsToIds } from 'routes/Annotator/helpers/Annotator.helper';

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

    if (!category) return;
    // 새로 생성할 annotation id
    const nextId = getLastAnnotaionIdByCategory(category) + 1;

    const categoriesToUpdate = createCategoriesToUpdate(
      categories,
      currentCategory.id,
      nextId,
    );
    if (!categoriesToUpdate) return;
    dispatch(setCategories(categoriesToUpdate));

    // 항목 1. paper 업데이트
    const compoundPathToAdd = new paper.CompoundPath({});
    const dataToAdd = {
      categoryId: currentCategory.id,
      annotationId: nextId,
    };
    compoundPathToAdd.data = dataToAdd;

    // 항목 3. currentAnnotation 업데이트
    const currentAnnotationToUpdate = {
      id: nextId,
      categoryId: currentCategory.id,
    };
    dispatch(setCurrentAnnotation(currentAnnotationToUpdate));
  }

  // last annotationId를 구하는 함수
  function getLastAnnotaionIdByCategory(category: CategoryType): number {
    if (category.annotations.length > 0) {
      const maxIdObject = category.annotations.reduce((max, current) => {
        return current.annotationId > max.annotationId ? current : max;
      });
      return maxIdObject.annotationId;
    }

    return -1;
  }

  // categoryId를 이용해 나머지 정보를 가져오는 함수
  function getCurrentCategoryData(
    categories: CategoryType[],
    currentCategory: CurrentCategoryType,
  ) {
    const category = categories.find(
      (category) => category.categoryId === currentCategory.id,
    );

    return category;
  }

  // categoriesToUpdate 생성하는 함수
  function createCategoriesToUpdate(
    categories: CategoryType[],
    currentCategoryId: number,
    newAnnotationId: number,
  ) {
    const categoryToUpdate = copyObject(
      categories.find((category) => category.categoryId === currentCategoryId),
    );

    if (!categoryToUpdate) return;

    const newAnnotation = {
      annotationId: newAnnotationId,
      isCrowd: false,
      isBbox: false,
      color: categoryToUpdate.color,
      segmentation: [],
      area: 0,
      bbox: [],
    };
    categoryToUpdate.annotations.push(newAnnotation);

    const categoriesToUpdate = categories.map((category) => {
      if (category.categoryId === currentCategoryId) {
        return categoryToUpdate;
      }

      return category;
    }) as CategoryType[];

    return categoriesToUpdate;
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

      paths.tempPath = selectedPath;
      console.dir(selectedPath);
    }

    console.log(`select annotation. (${categoryId}, ${annotationId})`);
    if (!categories) return;

    const selectedCategory = categories.find(
      (category) => category.categoryId === categoryId,
    );

    if (!selectedCategory) return;

    const selectedCurrentCategory = {
      id: selectedCategory.categoryId,
      name: selectedCategory.name,
      color: selectedCategory.color,
      annotations: annotationsToIds(selectedCategory.annotations),
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
      {currentCategory?.annotations.map((annotationId) => (
        <Annotation
          key={annotationId}
          categoryId={currentCategory.id}
          categoryColor={currentCategory.color}
          annotationId={annotationId}
          onClick={selectAnnotation}
        />
      ))}
    </Container>
  );
}
