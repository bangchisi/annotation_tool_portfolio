import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    margin: '20px 0',

    // For page buttons
    '& button': {
      color: '#0e1116',
    },
  };
});
