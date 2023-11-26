import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 36px 27px 0',
  };
});

export const FilesLabel = styled('label')(() => {
  return {
    padding: '6px 36px',
    userSelect: 'none',
    cursor: 'pointer',
    boxShadow: '0 0 0 2px rgba(0,0,0,0.25), 4px 4px 0 0 rgba(0,0,0,0.25)',
    fontWeight: 'bold',
    fontSize: '12px',
    color: 'rgba(0,0,0,0.25)',
    transition: 'all 0.15s ease-in-out',

    '&:hover': {
      boxShadow: '0 0 0 2px rgba(0,0,0,1), 4px 4px 0 0 rgba(0,0,0,1)',
      color: 'rgba(0,0,0,1)',
    },
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };
});
