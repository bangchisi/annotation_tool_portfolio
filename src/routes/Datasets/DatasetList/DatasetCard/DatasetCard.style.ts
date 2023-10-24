import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '100%',
    height: 'auto',
    display: 'flex',
    border: '1px solid rgba(0, 0, 0, 0.7)',
    padding: '20px 10px',
    marginBottom: '20px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100px',
    // height: '100px',
    overflow: 'hidden',
    flex: 1,
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    padding: '0 25px',
    // width: '200px',
    flex: 1,
  };
});

export const StatusContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px 30px',
    flex: 5,
  };
});

export const CategoriesContainer = styled('div')(() => {
  return {
    marginBottom: 10,
  };
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
    flex: 1,
  };
});
