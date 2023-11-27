import { Box, styled } from '@mui/material';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface AnnotationProps {
  annotationcolor: string;
}

export const Container = styled(Box)<AnnotationProps>(({ annotationcolor }) => {
  const textColor = getTextColor(annotationcolor);

  return {
    display: 'flex',
    height: 45,
    // backgroundColor: annotationcolor,
    font: textColor,
    color: textColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px',
    opacity: 0.9,
    borderBottom: '1px solid #88929D',
  };
});

export const AnnotationColorTag = styled('div')<AnnotationProps>(({
  annotationcolor,
}) => {
  return {
    display: 'flex',
    width: '12px',
    height: '23px',
    backgroundColor: annotationcolor,
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
