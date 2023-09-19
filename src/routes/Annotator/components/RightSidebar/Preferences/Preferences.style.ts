import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    padding: 20,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderLeft: 0,
    borderRight: 0,
    minHeight: '25%',
    maxHeight: '25%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  };
});
