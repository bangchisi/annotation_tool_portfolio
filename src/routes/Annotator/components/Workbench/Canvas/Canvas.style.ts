import { styled } from '@mui/material';

export const Editor = styled('canvas')(({}) => {
  // FIX: width and heigth into flexible values
  return {
    // display: 'block',
    // width: '700px',
    // height: '700px',
    width: '100%',
    height: 'auto',
    // maxHeight: '100%',
    backgroundColor: 'white',
  };
});
