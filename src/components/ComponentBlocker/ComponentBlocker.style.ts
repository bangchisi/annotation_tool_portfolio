import { Typography, styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(0.5px)',
    zIndex: 1000,
  };
});

export const Blocker = styled('div')(() => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 10px',
    borderRadius: '16px',
  };
});

export const Message = styled(Typography)(() => {
  return {
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  };
});
