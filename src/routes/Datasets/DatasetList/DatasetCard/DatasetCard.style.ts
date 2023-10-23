import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '100%',
    height: 'auto',
    display: 'flex',
    border: '1px solid rgba(0, 0, 0, 0.7)',
    padding: '15px 20px',
    marginBottom: '20px',
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    padding: '0 25px',
  };
});

export const StatusContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px 0',
  };
});

export const CategoriesContainer = styled('div')(() => {
  return {};
});

export const ProgressContainer = styled('div')(() => {
  return {};
});

export const MenuButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  };
});
