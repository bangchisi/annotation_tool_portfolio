import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '100%',
    display: 'flex',
    padding: '100px 100px 100px 200px',
  };
});

export const AuthTitle = styled('div')(() => {
  return {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
});
