import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '90%',
    height: 'auto',
    display: 'flex',
    border: '2px solid rgba(0, 0, 0, 0.3)',
    padding: '10px 10px',
    margin: '0 auto',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 3,
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
