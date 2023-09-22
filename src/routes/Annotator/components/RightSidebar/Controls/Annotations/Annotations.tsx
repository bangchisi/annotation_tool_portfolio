import Categories from './Categories/Categories';
import AnnotationList from './AnnotationList/AnnotationList';
import { Container } from './Annotatoins.style';
import { AnnotationType } from 'routes/Annotator/Annotator.types';

interface AnnotationsProps {
  annotations: AnnotationType[];
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>;
}

export default function Annotations({
  annotations,
  onAnnotationsChange,
}: AnnotationsProps) {
  return (
    <Container>
      <Categories />
      <AnnotationList
        annotations={annotations}
        onAnnotationsChange={onAnnotationsChange}
      />
    </Container>
  );
}
