import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
});

export const AuthTabs = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '70%',
    transform: 'translateY(2px)',
  };
});

export const AuthButton = styled('button')(() => {
  return {
    outline: 'none',
    border: 'none',
    backGround: 'none',
    padding: '5px 20px 5px 20px',
  };
});
