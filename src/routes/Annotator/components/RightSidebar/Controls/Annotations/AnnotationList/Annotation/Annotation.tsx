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
  deleteAnnotationInCategories: (annotationId: number) => void;
}

export function Annotation({
  categoryId,
  annotationId,
  annotationColor,
  categoryColor,
  onClick,
  setIsLoading,
  deleteAnnotationInCategories,
}: AnnotationProps) {
  async function onClickDeleteButton(categoryId: number, annotationId: number) {
    setIsLoading(true);
    try {
      const response = await AnnotatorModel.deleteAnnotation(annotationId);
      console.log('response', response);

      // TODO 1:
      // canvas에 있는 해당 compound 삭제
      deleteCompound(categoryId, annotationId);

      // TODO 2:
      // 1. delete `deleted annotation` in categories,
      // 2. currentCategory and currentAnnotation will be reloaded if categories changed
      // 3. reload annotation list. currentCategory changes -> annotation list reload
      // 결국 categories만 바꾸면 됨
      deleteAnnotationInCategories(annotationId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete annotation');
      alert('annotation 삭제 실패. 다시 시도 해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  function deleteCompound(categoryId: number, annotationId: number) {
    const children = paper.project.activeLayer.children;

    children.map((child) => {
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
