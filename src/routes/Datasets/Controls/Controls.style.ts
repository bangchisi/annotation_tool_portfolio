import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    margin: '15px 0',
    marginBottom: '65px',
  };
});
