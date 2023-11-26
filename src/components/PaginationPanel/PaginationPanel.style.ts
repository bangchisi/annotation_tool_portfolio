import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    margin: '16px 0',

    // For page buttons
    '& button': {
      color: '#0e1116',
    },
  };
});
