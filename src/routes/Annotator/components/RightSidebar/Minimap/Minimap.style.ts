import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '25%',
    maxHeight: '25%',
    overflow: 'hidden',
  };
});
