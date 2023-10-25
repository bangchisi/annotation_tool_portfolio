import { Button, styled } from '@mui/material';

export const FormContainer = styled('form')(() => {
  return {
    display: 'flex',
    padding: '0 10px',
    alignItems: 'center',
  };
});

export const SearchButton = styled(Button)(() => {
  return {
    marginLeft: '10px',
  };
});
