import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50%',
    maxHeight: '50%',
  };
});

export const TabContainer = styled('div')(() => {
  return {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
  };
});
