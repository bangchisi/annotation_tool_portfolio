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
  const focusedAnnotationColor = {
    backgroundColor: annotationcolor,
    color: getTextColor(annotationcolor),
  };
  const backgroundColor =
    annotationid === currentannotationid ? focusedAnnotationColor : {};
  return {
    display: 'flex',
    height: 45,
    color: '#0e1116',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px',
    opacity: 0.9,
    borderBottom: '1px solid #88929D',
    ...backgroundColor,

    '&:hover': {
      ...focusedAnnotationColor,
    },
  };
});

export const AnnotationColorTag = styled('div')<AnnotationProps>(({
  annotationcolor,
  currentannotationid,
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
  ({ annotationcolor }) => {
    const textColor = getTextColor(annotationcolor);

    return {
      color: textColor,
      marginLeft: '10px',
      ':hover': {
        opacity: 0.5,
      },
    };
  },
);
