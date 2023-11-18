import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid rgba(0, 0, 0, 0.5)',
    padding: 5,
    width: '200px',
    height: 'auto',
  };
});
