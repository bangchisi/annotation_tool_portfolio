import { styled, useMediaQuery } from '@mui/material';

export const Container = styled('div')(() => {
  const matches = useMediaQuery(`(min-width: 1024px)`);

  return {
    display: 'grid',
    gridTemplateColumns: matches ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
    gap: '10px 0px',
    alignItems: 'center', // 수직 가운데 정렬
    justifyItems: 'center', // 수평 가운데 정렬
    padding: '0 100px',
  };
});
