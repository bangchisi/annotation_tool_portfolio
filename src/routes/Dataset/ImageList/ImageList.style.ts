import { styled, useMediaQuery } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
});
