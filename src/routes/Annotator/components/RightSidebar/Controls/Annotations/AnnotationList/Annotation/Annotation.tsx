import { Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import { useMemo } from 'react';
import useManageAnnotation from 'routes/Annotator/hooks/useManageAnnotation';
import { selectAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import {
  AnnotationColorTag,
  Container,
  DeleteButton,
  SelectPanel,
} from './Annotation.style';

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
  const { categories, currentAnnotation } = useAppSelector(selectAnnotator);
  const categoriesList = useMemo(() => {
    return (
      Object.values(categories || {}).map((category) => category.name) || []
    );
  }, [categories]);

  const currentAnnotationId = useMemo(
    () => currentAnnotation?.annotationId,
    [currentAnnotation],
  );

  return (
    <Container
      annotationcolor={annotationcolor}
      annotationid={annotationId}
      currentannotationid={currentAnnotationId}
      onClick={() => onClick(categoryId, annotationId)}
    >
      <AnnotationColorTag
        annotationcolor={annotationcolor}
        annotationid={annotationId}
        currentannotationid={currentAnnotationId}
      />
      <Typography variant="button" display="inline">
        {annotationId}
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
