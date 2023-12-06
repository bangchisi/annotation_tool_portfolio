import { TextField, styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid #20252c',
    padding: '10px 20px',
    borderRadius: '3px',
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    '& > .title': {
      fontSize: '24px',
    },
    '& > .created': {
      fontSize: '12px',
      marginTop: '-6px',
      lineHeight: '1',
    },
  };
});

export const ContentContainer = styled('div')(() => {
  return {
    marginTop: '12px',

    '& > .description': {
      fontSize: '14px',
      FontWeight: 'bold',
      marginBottom: '-6px',
    },
    '& > .content': {
      fontSize: '14px',
    },
  };
});

export const NameField = styled(TextField)(() => {
  return {
    '& .MuiInputBase-root': {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      width: 'fit-content',
    },
  };
});

export const DescriptionField = styled(TextField)(() => {
  return {
    '& .MuiInputBase-root': {
      fontSize: '14px',
    },
  };
});
