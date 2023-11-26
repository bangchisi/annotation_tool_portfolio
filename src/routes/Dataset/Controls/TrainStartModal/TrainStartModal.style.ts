import { Box, Select, TextField, styled } from '@mui/material';

// interface CategoryTagProps {
//   categorycolor: string;
//   textcolor: string;
// }

export const Container = styled('div')(() => {
  return {
    marginRight: 'auto',
  };
});

export const ModalShadowContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };
});

export const ModalShadow = styled('div')(() => {
  return {
    boxShadow: '0 5px 10px rgba(0,0,0,0.3)',
  };
});

export const ModalBody = styled('div')(() => {
  return {
    backgroundColor: '#F6FAFD',
    border: '1px solid #1976D2',
    width: '400px',
    borderRadius: 3,
    padding: '0px 10px 10px 10px',
    outline: 'none',
  };
});

export const ModalHeader = styled('div')(() => {
  return {
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    color: '#0e1116',
  };
});

export const ModalContent = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid #1976D2',
    padding: 15,
    borderRadius: 3,
    justifyContent: 'space-between',
  };
});

export const ModalFooter = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
  };
});

export const InputField = styled(TextField)(() => {
  return {
    marginBottom: 15,
  };
});

export const TrainContainer = styled(Box)(() => {
  return {
    display: 'flex',
    marginTop: 15,
  };
});

export const SelectField = styled(Select)(() => {
  return {
    width: '100%',
    marginRight: 15,
  };
});

export const FieldContainer = styled(Box)(() => {
  return {
    marginBottom: '12px',

    '& p': {
      fontSize: '14px',
    },
  };
});
