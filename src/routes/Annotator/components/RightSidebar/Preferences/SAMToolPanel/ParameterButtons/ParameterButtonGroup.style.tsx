import { ToggleButton, ToggleButtonGroup, styled } from '@mui/material';

export const Container = styled(ToggleButtonGroup)(() => {
  return {
    width: '100%',
    display: 'flex',
  };
});

export const ParameterButton = styled(ToggleButton)(() => {
  return {
    flex: 1,
  };
});
