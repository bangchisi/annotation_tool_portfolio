import { Box, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 200px))',
    justifyContent: 'center',
    gap: '10px',
  };
});
