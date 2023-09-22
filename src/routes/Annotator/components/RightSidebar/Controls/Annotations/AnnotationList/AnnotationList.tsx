import { AnnotationType } from 'routes/Annotator/Annotator.types';
import { Container } from './AnnotationList.style';

interface AnnotationListProps {
  annotations: AnnotationType[];
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>;
}

export default function AnnotationList({
  annotations,
  onAnnotationsChange,
}: AnnotationListProps) {
  // TODO: categories should be 'API response' later

  return (
    <Container>
      {annotations.map((annotation, index) => {
        return (
          <div key={index}>
            <span>annotation</span>
            <span>some path</span>
          </div>
        );
      })}
    </Container>
  );
}
