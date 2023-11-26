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

export const CreateButton = styled(Button)(() => {
  return {
    border: '1px solid #368cf9',
    borderRadius: '4px',
    height: '40px',
    transition: 'background-color 0.3s ease-in-out',
    backgroundColor: '#DFF7FF',
    color: '#0e1116',
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
    padding: '0px 7px 7px 7px',
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

// export const CategoryTag = styled('button')<CategoryTagProps>(({
//   categorycolor,
//   textcolor,
// }) => {
//   return {
//     backgroundColor: categorycolor,
//     color: textcolor,
//     border: 'none',
//     borderRadius: 10,
//     margin: '2px 5px',
//   };
// });
