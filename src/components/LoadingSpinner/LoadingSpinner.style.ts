import { CircularProgress, Typography, styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)',
    zIndex: 1001,
  };
});

export const Spinner = styled('div')(() => {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 10px',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };
});

export const Progress = styled(CircularProgress)(() => {
  return {};
});

export const Message = styled(Typography)(() => {
  return {
    marginTop: '20px',
  };
});
