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

export const ParameterContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 15,
  };
});

export const ParameterContent = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };
});

export const RangeLabelContainer = styled(Box)(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
});

export const EverythingButton = styled(Button)(() => {
  return {
    width: '100%',
  };
});
