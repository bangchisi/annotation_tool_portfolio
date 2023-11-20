import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    padding: 20,
    borderLeft: 0,
    borderRight: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };
});
