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
    justifyContent: 'space-between',
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    //
  };
});

export const StatusContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

export const TitleStatusContainer = styled('div')(() => {
  return {};
});

export const CategoriesContainerScrollbarWindow = styled('div')(() => {
  return {
    overflow: 'hidden',
  };
});

export const CategoriesContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'auto',
    userSelect: 'none',
  };
});

export const CategoriesPadding = styled('div')(() => {
  return {
    display: 'flex',
    height: '27px',
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
  };
});
