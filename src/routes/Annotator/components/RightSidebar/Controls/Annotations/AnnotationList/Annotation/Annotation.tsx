import paper from 'paper';
import { Typography } from '@mui/material';
import { Container, DeleteButton, SelectPanel } from './Annotation.style';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import AnnotatorModel from 'routes/Annotator/models/Annotator.model';

interface AnnotationProps {
  categoryId: number;
  annotationId: number;
  annotationColor: string;
  categoryColor: string;
  onClick: (categoryId: number, annotationId: number) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAnnotationInCategory: (annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  annotationColor,
  categoryColor,
  onClick,
  setIsLoading,
  deleteAnnotationInCategory,
}: AnnotationProps) {
  async function onClickDeleteButton(categoryId: number, annotationId: number) {
    setIsLoading(true);
    try {
      const response = await AnnotatorModel.deleteAnnotation(annotationId);
      if (response.status !== 200)
        throw new Error('Failed to delete annotation');

      // delete compound in canvas
      deleteCompound(categoryId, annotationId);

      deleteAnnotationInCategory(annotationId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete annotation');
      alert('annotation 삭제 실패. 다시 시도 해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  function deleteCompound(categoryId: number, annotationId: number) {
    const childrenCompound = paper.project.activeLayer.children.filter(
      (child) => child instanceof paper.CompoundPath,
    );

    childrenCompound.forEach((child) => {
      if (
        child.data.categoryId === categoryId &&
        child.data.annotationId === annotationId
      ) {
        child.remove();
      }
    });
  }

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
        onClick={() => onClickDeleteButton(categoryId, annotationId)}
      />
    </Container>
  );
}
