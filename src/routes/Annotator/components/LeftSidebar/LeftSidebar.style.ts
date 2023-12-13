import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    paddingTop: 10,
    width: '50px',
    minWidth: '50px',
    borderRight: '1px solid var(--border-color)',
  };
});
