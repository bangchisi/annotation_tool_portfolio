import { Typography } from '@mui/material';
import {
  Container,
  DeleteButton,
  SelectPanel,
  AnnotationColorTag,
} from './Annotation.style';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import { useAppSelector } from 'App.hooks';
import { useMemo } from 'react';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  annotationcolor: string;
  onClick: (categoryId: number, annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  annotationcolor,
  onClick,
}: AnnotationProps) {
  const { onClickDeleteButton } = useManageAnnotation();
  const { categories } = useAppSelector(selectAnnotator);
  const categoriesList = useMemo(() => {
    return (
      Object.values(categories || {}).map((category) => category.name) || []
    );
  }, [categories]);

  return (
    <Container
      annotationcolor={annotationcolor}
      onClick={() => onClick(categoryId, annotationId)}
    >
      <AnnotationColorTag annotationcolor={annotationcolor} />
      <Typography variant="button" display="inline">
        (id: {annotationId})
      </Typography>
      <SelectPanel>
        {categoriesList.length > 0 &&
          categoriesList.map((categoryName) => (
            <option key={categoryName}>{categoryName}</option>
          ))}
      </SelectPanel>
      <DeleteButton
        annotationcolor={annotationcolor}
        onClick={() => onClickDeleteButton(categoryId, annotationId)}
      />
    </Container>
  );
}
