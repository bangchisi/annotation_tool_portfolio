import { Button, TextField, styled } from '@mui/material';

export const FormContainer = styled('form')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 60px 40px 60px',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0 0 5px 5px',
    width: '70%',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
  };
});

export const InputField = styled(TextField)(() => {
  return {
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(175, 175, 175, 0.1)',
  };
});

export const RegisterButton = styled(Button)(() => {
  return {};
});
