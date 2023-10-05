import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { Container } from './Annotation.style';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { setCurrentAnnotation } from 'routes/Annotator/slices/annotatorSlice';
import { useEffect } from 'react';

interface AnnotationProps {
  annotation: AnnotationType;
}

export function Annotation({ annotation }: AnnotationProps) {
  const currentCategory = useAppSelector(
    (state) => state.annotator.currentCategory,
  );
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
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

      dispatch(setCurrentAnnotation(selectedAnnotation));
    }
  };

  useEffect(() => {
    if (currentAnnotation && currentAnnotation.path) {
      console.log(currentAnnotation.path);
    }
  }, []);

  // useEffect(() => {
  //   console.log('Annotation.tsx, useEffect, [currentAnnotation]');
  //   if (currentAnnotation && currentAnnotation.path) {
  //     console.log('currentAnnotation.path is');
  //     console.dir(currentAnnotation.path);
  //   }
  // }, [currentAnnotation]);

  return (
    <Container
      onClick={handleClick}
      data-annotationid={annotation.id}
      data-categoryid={annotation.categoryId}
    >
      {annotation && (
        <div>
          (id: {annotation.id}) {annotation.path === null && 'empty'}
        </div>
      )}
    </Container>
  );
}
