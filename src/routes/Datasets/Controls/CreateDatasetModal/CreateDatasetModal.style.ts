import { Button, TextField, styled } from '@mui/material';

// interface CategoryTagProps {
//   categorycolor: string;
//   textcolor: string;
// }

export const Container = styled('div')(() => {
  return {
    marginRight: '55px',
  };
});

export const CreateButton = styled(Button)`
  border-radius: 3px;
  transition: all 0.25s ease-in-out;
  color: white;
  background-color: #005af0;
  font-size: 12px;
  line-height: 1rem;
  width: 125px;
  height: 40px;
  padding: 2px;
  animation: none;

  &:hover {
    background-color: #0045b9;
    box-shadow:
      0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14),
      0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  }
`;

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
    padding: 15,
    borderRadius: 3,
    justifyContent: 'space-between',
    border: '1px solid #1976D2',
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
