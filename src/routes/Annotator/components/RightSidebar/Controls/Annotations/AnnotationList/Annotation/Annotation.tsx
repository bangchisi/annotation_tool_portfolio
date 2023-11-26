import paper from 'paper';
import { Typography } from '@mui/material';
import { Container, DeleteButton, SelectPanel } from './Annotation.style';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  annotationColor: string;
  categoryColor: string;
  onClick: (categoryId: number, annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  annotationColor,
  categoryColor,
  onClick,
}: AnnotationProps) {
  const { onClickDeleteButton } = useManageAnnotation();

  return (
    <Container
      categorycolor={categoryColor}
      annotationcolor={annotationColor}
      onClick={() => onClick(categoryId, annotationId)}
    >
      <Typography variant="button" display="inline">
        (id: {annotationId})
      </Typography>
      <SelectPanel>
        <option>cat</option>
        <option>dog</option>
        <option>animal</option>
      </SelectPanel>
      <DeleteButton
        categorycolor={categoryColor}
        annotationcolor={annotationColor}
        // onClick={() => onClickDeleteButton(categoryId, annotationId)}
        onClick={() => onClickDeleteButton(categoryId, annotationId)}
      />
    </Container>
  );
}
