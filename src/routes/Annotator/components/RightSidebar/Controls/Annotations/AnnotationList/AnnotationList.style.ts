import { styled } from '@mui/material';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';

export const Container = styled('div')(() => {
  return {
    overflowY: 'auto',
    minHeight: '350px',
    maxHeight: '350px',
  };
});

export const AddButton = styled(FunctionIcon)(() => {
  return {};
});
