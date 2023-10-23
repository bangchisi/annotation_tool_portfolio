import { styled } from '@mui/material';

interface AuthButtonProps {
  'data-selected': boolean;
}

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

export const AuthButton = styled('button')<AuthButtonProps>((props) => {
  const selected = props['data-selected'];

  return {
    outline: 'none',
    border: selected ? '2px solid rgba(0, 0, 0, 0.1)' : 'none',
    borderBottom: 'none',
    background: selected ? 'white' : 'none',
    padding: '5px 20px 5px 20px',
  };
});
