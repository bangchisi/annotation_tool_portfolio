import { Box, Select, TextField, keyframes, styled } from '@mui/material';
import { CreateButton } from '../../../../routes/Datasets/Controls/CreateDatasetModal/CreateDatasetModal.style';

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

const borderDance = keyframes`
  0% {
    background-position:
      left top,
      right bottom,
      left bottom,
      right top;
  }
  100% {
    background-position:
      left 13px top,
      right 13px bottom,
      left bottom 13px,
      right top 13px;
  }
`;

export const TrainModelButton = styled(CreateButton)`
  &:hover {
    background-color: #005af0;
    background-image: linear-gradient(90deg, #005af0 50%, white 50%),
      linear-gradient(90deg, #005af0 50%, white 50%),
      linear-gradient(0deg, #005af0 50%, white 50%),
      linear-gradient(0deg, #005af0 50%, white 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size:
      13px 2px,
      13px 2px,
      2px 13px,
      2px 13px;
    background-position:
      left top,
      left bottom,
      right bottom,
      right top;
    animation: ${borderDance} 0.275s infinite linear;
    box-shadow: none;
  }
`;
