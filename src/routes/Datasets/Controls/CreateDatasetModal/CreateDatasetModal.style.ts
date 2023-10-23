import { Button, styled } from '@mui/material';

// interface CategoryTagProps {
//   categorycolor: string;
//   textcolor: string;
// }

export const Container = styled('div')(() => {
  return {
    marginLeft: 'auto',
  };
});

export const CreateButton = styled(Button)(() => {
  return {};
});

export const ModalBody = styled('div')(() => {
  return {
    backgroundColor: 'rgba(215, 215, 215, 1)',
    width: '400px',
    height: 'auto',
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
    padding: 5,
    borderRadius: 3,
  };
});

export const ModalFooter = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
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
