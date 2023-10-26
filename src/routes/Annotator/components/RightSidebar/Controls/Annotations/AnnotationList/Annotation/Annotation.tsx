import { Typography } from '@mui/material';
import { Container, DeleteButton, SelectPanel } from './Annotation.style';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  categoryColor: string;
  onClick: (categoryId: number, annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  categoryColor,
  onClick,
}: AnnotationProps) {
  return (
    <Container
      categorycolor={categoryColor}
      onClick={() => onClick(categoryId, annotationId)}
    >
      {categoryId >= 0 && (
        <Typography variant="button" display="inline">
          (id: {annotationId})
        </Typography>
      )}
      <SelectPanel>
        <option>cat</option>
        <option>dog</option>
        <option>animal</option>
      </SelectPanel>
      <DeleteButton categorycolor={categoryColor} />
    </Container>
  );
}
