import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '270px',
    minWidth: '270px',
    position: 'relative',
    borderLeft: '1px solid var(--border-color)',
  };
});
