import { Button, TextField, styled } from '@mui/material';

export const CreateButton = styled(Button)(() => {
  return {};
});

export const ModalBody = styled('div')(() => {
  return {
    backgroundColor: 'rgba(215, 215, 215, 1)',
    width: '400px',
    borderRadius: 3,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '5px 5px',
  };
});

export const ModalHeader = styled('div')(() => {
  return {
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
  };
});

export const ModalContent = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 15,
    borderRadius: 3,
    justifyContent: 'space-between',
  };
});

export const ModalFooter = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '12px',
  };
});

export const InputField = styled(TextField)(() => {
  return {
    marginBottom: 15,
  };
});
