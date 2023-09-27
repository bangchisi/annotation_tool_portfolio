import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { Container } from './Annotation.style';
import { useAppDispatch } from 'App.hooks';
import { setCurrentAnnotation } from 'routes/Annotator/slices/annotatorSlice';

interface AnnotationProps {
  annotation: AnnotationType;
}

export function Annotation({ annotation }: AnnotationProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    console.log('select annotation');
    if (annotation) {
      console.dir(annotation);

      dispatch(setCurrentAnnotation({ currentAnnotation: annotation }));
    }
  };

  return (
    <Container onClick={handleClick}>
      {annotation && (
        <div>
          <span>(id: {annotation.id})</span>
        </div>
      )}
    </Container>
  );
}
