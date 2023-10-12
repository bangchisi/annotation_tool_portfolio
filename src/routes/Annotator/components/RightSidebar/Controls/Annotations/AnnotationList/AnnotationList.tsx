import { Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';
import { Annotation } from './Annotation/Annotation';
import { paths } from 'routes/Annotator/Annotator';
import { PathType } from 'routes/Annotator/utils/PathStore';
import { AnnotationType, CategoryType } from 'routes/Annotator/Annotator.types';
import {
  setCategories,
  setCurrentAnnotation,
  setCurrentCategory,
} from 'routes/Annotator/slices/annotatorSlice';

export default function AnnotationList() {
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const dispatch = useAppDispatch();

  // 새 empty annotation 생성
  function createNewAnnotation() {
    // currentCategory 없으면 return
    if (!currentCategory) return;

    let lastId = -1;
    // TODO: 해당하는 categories.category에 annotationId를 append
    console.log('create annotation');
    // paths에 새 path를 push하고 categories를 업데이트 하는 함수 작성
    // paths에서 currentCategory.id인 path 찾음
    const currentPaths = paths.getCategoryPath(currentCategory.id);
    lastId = currentPaths.getLastAnnotationId();

    // new path 생성
    const newPath: PathType = {
      segmentations: [],
      categoryId: currentCategory.id,
      annotationId: lastId + 1,
    };

    // new path를 paths에 push
    paths.appendPath(newPath);

    // categories 업데이트
    const newCategories: CategoryType[] = JSON.parse(
      JSON.stringify(categories),
    );
    // categories에서 currentCategory에 해당하는 category 찾음
    const categoryToUpdate = newCategories.find(
      (category) => category.id === currentCategory.id,
    );

    // 해당하는 category 없으면 return
    if (!categoryToUpdate) return;

    // 해당 category.annotations에 annotationId를 push
    if (categoryToUpdate) {
      categoryToUpdate.annotations.push(newPath.annotationId);
    }

    // cateogories 업데이트
    dispatch(setCategories(newCategories));
    // currentCategory 업데이트
    dispatch(setCurrentCategory(categoryToUpdate));
    // currentAnnotation 업데이트, 새로 생성한 annotation으로
    dispatch(
      setCurrentAnnotation({
        categoryId: newPath.categoryId,
        id: newPath.annotationId,
      }),
    );
  }

  // annotation 선택
  function selectAnnotation(categoryId: number, annotationId: number) {
    console.log(`select annotation. (${categoryId}, ${annotationId})`);
    if (!categories) return;

    const selectedCategory = categories.find(
      (category) => category.id === categoryId,
    );
    if (!selectedCategory) return;
    dispatch(setCurrentCategory(selectedCategory));

    const selectedAnnotation: AnnotationType = {
      categoryId: selectedCategory.id,
      id: annotationId,
    };
    dispatch(setCurrentAnnotation(selectedAnnotation));
  }

  return (
    <Container>
      <FunctionIcon
        functionName="Add annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createNewAnnotation}
        placement="left"
        isFunction={true}
      />
      {currentCategory?.annotations.map((annotation) => (
        <Annotation
          key={`${currentCategory.id}+${annotation}`}
          categoryId={currentCategory.id}
          annotationId={annotation}
          onClick={selectAnnotation}
        />
      ))}
    </Container>
  );
}
