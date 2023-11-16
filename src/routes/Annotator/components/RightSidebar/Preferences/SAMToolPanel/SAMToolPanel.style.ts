import { Box, Button, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {};
});

export const ModelContainer = styled(Box)(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 7,
  };
});

export const SelectModel = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  };
});

export const SliderContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

export const SliderContent = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
  };
});

export const EverythingButton = styled(Button)(() => {
  return {
    width: '100%',
  };
});
