import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 16px',
    marginTop: '30px',
    gap: '7px',
  };
});
