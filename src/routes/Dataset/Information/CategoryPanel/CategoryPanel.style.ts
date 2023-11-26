import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    border: '1px solid #20252c',
    padding: '15px 15px',
    margin: '10px 0',
    borderRadius: '3px',
  };
});

export const InputCategory = styled('div')(() => {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '10px 0',
  };
});
