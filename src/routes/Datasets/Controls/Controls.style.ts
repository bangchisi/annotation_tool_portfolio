import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
    padding: '0 9%',
  };
});

export const LeftControl = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };
});
