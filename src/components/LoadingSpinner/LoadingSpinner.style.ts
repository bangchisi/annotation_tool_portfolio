import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  };
});

export const Spinner = styled('div')(() => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  };
});
