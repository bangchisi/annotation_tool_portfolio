import { Box, Button, Typography, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    display: 'flex',
    marginBottom: '10px',
  };
});

export const Property = styled(Box)(() => {
  return {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    wordWrap: 'break-word',
    padding: '5px',
  };
});

export const PropertyName = styled(Typography)(() => {
  return {
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(0, 0, 0, 1)',
  };
});

export const PropertyValue = styled(Typography)(() => {
  return {};
});

export const DeleteButton = styled(Button)(() => {
  return {
    margin: '10px 15px',
  };
});
