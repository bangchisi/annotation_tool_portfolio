import { Box, styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
  };
});

export const TrainContainer = styled(Box)(() => {
  return {
    display: 'flex',
    marginRight: 'auto',
  };
});
