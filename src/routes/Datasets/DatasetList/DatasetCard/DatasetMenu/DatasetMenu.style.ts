import { Button, styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '32px',
    height: '32px',
    borderRadius: '100%',
    overflow: 'hidden',
  };
});

export const MenuButton = styled(Button)(() => {
  return {
    color: 'black',
    height: '100%',
    width: '100%',
    minWidth: '0 !important',
  };
});
