import { Tooltip, Typography } from '@mui/material';
import { Container, DeleteButton, SelectPanel } from './Annotation.style';
import { useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  annotationColor: string;
  categoryColor: string;
  onClick: (categoryId: number, annotationId: number) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Annotation({
  categoryId,
  annotationId,
  annotationColor,
  categoryColor,
  onClick,
  setIsLoading,
}: AnnotationProps) {
  const [open, setOpen] = useState(false);

  async function onClickDeleteButton(annotationId: number) {
    setIsLoading(true);
    try {
      const response = await AnnotatorModel.deleteAnnotation(annotationId);
      console.log('response', response);

      // TODO: reload annotation list, currentCategory, currentAnnotation, categories
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete annotation');
      alert('annotation 삭제 실패. 다시 시도 해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container
      categorycolor={categoryColor}
      annotationcolor={annotationColor}
      onClick={() => onClick(categoryId, annotationId)}
    >
      {categoryId >= 0 && (
        <Tooltip
          title="annotation name"
          onClick={() => setOpen((prev) => !prev)}
          open={open}
          disableHoverListener
          disableFocusListener
          disableTouchListener
        >
          <Typography variant="button" display="inline">
            (id: {annotationId})
          </Typography>
        </Tooltip>
      )}
      <SelectPanel>
        <option>cat</option>
        <option>dog</option>
        <option>animal</option>
      </SelectPanel>
      <DeleteButton
        categorycolor={categoryColor}
        annotationcolor={annotationColor}
        onClick={() => onClickDeleteButton(annotationId)}
      />
    </Container>
  );
}
