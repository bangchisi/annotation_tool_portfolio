import { Container } from './AnnotationList.style';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';
import { Annotation } from './Annotation/Annotation';
import {
  addAnnotation,
  setCurrentAnnotation,
} from 'routes/Annotator/slices/annotatorSlice';

export default function AnnotationList() {
  const categories = useAppSelector((state) => state.annotator.categories);
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const dispatch = useAppDispatch();

  function createAnnotation() {
    console.log('create annotation');
    dispatch(
      addAnnotation({
        newAnnotation: {
          id: currentCategory?.annotations.length,
          categoryId: currentCategory?.id,
          path: null,
        },
      }),
    );

    dispatch(
      setCurrentAnnotation({
        currentAnnotation: {
          id: currentCategory?.annotations.length,
          categoryId: currentCategory?.id,
          path: null,
        },
      }),
    );
  }

  return (
    <Container>
      <FunctionIcon
        functionName="Add annotation"
        iconComponent={<AddCircleOutlineOutlinedIcon />}
        handleClick={createAnnotation}
        placement="left"
        isFunction={true}
      />
      {categories
        .filter((category) => category.id === currentCategory?.id)
        .map((category) =>
          category.annotations.map((annotation) => (
            <Annotation key={annotation.id} annotation={annotation} />
          )),
        )}
    </Container>
  );
}
