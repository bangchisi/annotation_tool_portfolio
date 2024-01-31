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

// 단일 어노테이션 컴포넌트
export function Annotation({
  categoryId,
  annotationId,
  annotationcolor,
  onClick,
}: AnnotationProps) {
  const { onClickDeleteButton } = useManageAnnotation(); // 어노테이션 삭제 함수
  const { categories, currentAnnotation } = useAppSelector(selectAnnotator); // 카테고리 목록, 현재 선택된 어노테이션
  const categoriesList = useMemo(() => {
    return (
      Object.values(categories || {}).map((category) => category.name) || []
    );
  }, [categories]); // 카테고리 목록을 배열로 변환

  // 현재 선택된 어노테이션의 id
  const currentAnnotationId = useMemo(
    () => currentAnnotation?.annotationId,
    [currentAnnotation],
  );

  // 현재 어노테이션이 현재 선택된 어노테이션인지 여부. 어노테이션 컴포넌트의 스타일을 변경(강조)하기 위해 사용
  const isCurrentAnnotation = useMemo(
    () => annotationId === currentAnnotationId,
    [annotationId, currentAnnotationId],
  );

  return (
    <Container
      annotationcolor={annotationcolor}
      annotationid={annotationId}
      currentannotationid={currentAnnotationId}
      onClick={() => onClick(categoryId, annotationId)}
      className={
        isCurrentAnnotation
          ? 'current-annotation annotation-list-step'
          : 'annotation-list-step'
      }
    >
      {/* 어노테이션 배경 색상 */}
      <AnnotationColorTag
        annotationcolor={annotationcolor}
        annotationid={annotationId}
        currentannotationid={currentAnnotationId}
      />
      {/* 어노테이션 id */}
      <Typography variant="button" className="annotation-id">
        {annotationId}
      </Typography>
      {/* SelectPanel은 해당 어노테이션의 카테고리를 변경하기 위한 기능을 구현 할 예정이었으나 미구현 상태. */}
      {/* <SelectPanel>
        {categoriesList.length > 0 &&
          categoriesList.map((categoryName) => (
            <option key={categoryName}>{categoryName}</option>
          ))}
      </SelectPanel> */}
      {/* 어노테이션 삭제 버튼 우측 정렬을 위한 div 공간 */}
      <div style={{ marginLeft: 'auto' }}></div>
      {/* 어노테이션 삭제 버튼 */}
      <DeleteButton
        annotationcolor={annotationcolor}
        onClick={() => onClickDeleteButton(categoryId, annotationId)}
        className="delete-button"
        fontSize="small"
      />
    </Container>
  );
}
