import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { Container } from './Annotation.style';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCurrentAnnotation } from 'routes/Annotator/slices/annotatorSlice';

interface AnnotationProps {
  annotation: AnnotationType;
}

export function Annotation({ annotation }: AnnotationProps) {
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    console.log('select annotation');
    if (annotation) {
      // dataset에서 annotationId 가져옴
      const { annotationid: annotationId } = event.currentTarget.dataset;

      // currentCategory에서 annotation 고름
      const selectedAnnotation = currentCategory?.annotations.find(
        // dataset 값은 string이라 number로 변환
        (annotation) => annotation.id === Number(annotationId),
      );

      dispatch(setCurrentAnnotation({ currentAnnotation: selectedAnnotation }));
    }
  };

  return (
    <Container
      onClick={handleClick}
      data-annotationid={annotation.id}
      data-categoryid={annotation.categoryId}
    >
      {annotation && <div>(id: {annotation.id})</div>}
    </Container>
  );
}
