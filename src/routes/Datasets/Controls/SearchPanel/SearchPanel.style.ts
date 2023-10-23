import { Button, styled } from '@mui/material';

export const FormContainer = styled('form')(() => {
  return {
    display: 'flex',
    padding: '0 10px',
  };
});

export const SearchButton = styled(Button)(() => {
  return {
    marginLeft: '5px',
  };
});
