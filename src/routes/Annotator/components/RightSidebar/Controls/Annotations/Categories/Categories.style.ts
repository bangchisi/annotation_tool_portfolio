import { FormControl, NativeSelect, styled } from '@mui/material';

export const Container = styled(FormControl)(() => {
  return {};
});

export const Select = styled(NativeSelect)(() => {
  return {
    padding: '5px 15px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    outline: 'none',
    borderBottom: '1px solid #20252c',

    '&:hover::before': {
      border: 'none !important',
    },
  };
});
