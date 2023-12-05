import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { Box, styled } from '@mui/material';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';

interface AnnotationProps {
  annotationcolor: string;
  annotationid?: number;
  currentannotationid?: number;
}

export const Container = styled(Box)<AnnotationProps>(({
  annotationcolor,
  annotationid,
  currentannotationid,
}) => {
  const textColor = getTextColor(annotationcolor);
  const isCurrentAnnotation = annotationid === currentannotationid;

  const focusedAnnotationColor = {
    backgroundColor: annotationcolor,
    color: textColor,
  };
  const backgroundColor = isCurrentAnnotation ? focusedAnnotationColor : {};
  return {
    display: 'flex',
    height: 45,
    color: '#0e1116',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 8px 10px 14px',
    opacity: 0.9,
    // 현재 선택된 annotation의 하단 border를 제거
    borderBottom: `1px solid ${
      isCurrentAnnotation ? 'transparent' : '#88929D'
    }`,
    ...backgroundColor,

    '&:hover': {
      ...focusedAnnotationColor,
    },
    // 현재 선택된 annotation의 상단 border를 제거
    '&:has(+ .current-annotation)': {
      borderBottom: '1px solid transparent',
    },

    // 목록 위에 호버를 감지하기 위해 스타일을 DeleteButton에서
    // 적용하지고않고 상위 컴포넌트에 적용
    '& .delete-button': {
      color: isCurrentAnnotation ? textColor : '#0e1116',
      marginLeft: '10px',
    },
    '&:hover .delete-button': {
      color: getTextColor(annotationcolor),
    },

    '& .annotation-id': {
      lineHeight: '1 !important',
    },
  };
});

export const AnnotationColorTag = styled('div')<AnnotationProps>(({
  annotationcolor,
}) => {
  return {
    display: 'flex',
    width: '10px',
    height: '22px',
    backgroundColor: annotationcolor,
    marginRight: '10px',
  };
});

export const SelectPanel = styled('select')(() => {
  return {
    marginLeft: 'auto',
    marginRight: '1px',
  };
});

export const DeleteButton = styled(DeleteForeverOutlinedIcon)<AnnotationProps>(
  () => {
    return {
      //
    };
  },
);
