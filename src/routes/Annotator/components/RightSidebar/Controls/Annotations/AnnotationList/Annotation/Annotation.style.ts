import { Box, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    borderBottom: 1,
    display: 'flex',
    height: 45,
    backgroundColor: 'rgba(50, 50, 195, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
  };
});
