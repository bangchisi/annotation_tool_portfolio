import { Box, styled } from '@mui/material';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface AnnotationProps {
  categorycolor: string;
  annotationcolor: string;
}

export const Container = styled(Box)<AnnotationProps>(({ annotationcolor }) => {
  const textColor = getTextColor(annotationcolor);

  return {
    borderBottom: 1,
    display: 'flex',
    height: 45,
    backgroundColor: annotationcolor,
    font: textColor,
    color: textColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px',
    marginBottom: '1px',
    opacity: 0.9,
    ':hover': {
      boxShadow: `0 0 0 1px ${textColor} inset`,
    },
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
