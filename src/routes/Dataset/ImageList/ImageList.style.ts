import { styled, useMediaQuery } from '@mui/material';

export const Container = styled('div')(() => {
  const matches = useMediaQuery(`(min-width: 1024px)`);

  return {
    display: 'grid',
    gridTemplateColumns: matches
      ? 'repeat(auto-fill, minmax(20%, 20%))'
      : 'repeat(auto-fill, minmax(33%, 33%))',
    gap: '10px',
    alignItems: 'center', // 수직 가운데 정렬
  };
});
