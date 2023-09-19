import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '270px',
    minWidth: '270px',
    position: 'relative',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
  };
});
