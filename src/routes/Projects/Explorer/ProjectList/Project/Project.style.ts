import { Box, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    width: '200px',
    height: '150px',
    border: '1px solid rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
  };
});
