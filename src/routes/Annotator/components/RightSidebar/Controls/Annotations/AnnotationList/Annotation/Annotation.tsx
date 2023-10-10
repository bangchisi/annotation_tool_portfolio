import { Container } from './Annotation.style';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  onClick: (categoryId: number, annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  onClick,
}: AnnotationProps) {
  return (
    <Container onClick={() => onClick(categoryId, annotationId)}>
      {categoryId >= 0 && <div>(id: {annotationId})</div>}
    </Container>
  );
}
