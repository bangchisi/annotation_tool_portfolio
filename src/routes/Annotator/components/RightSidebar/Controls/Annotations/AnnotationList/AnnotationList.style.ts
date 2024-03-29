import { styled } from '@mui/material';
import FunctionIcon from 'routes/Annotator/components/LeftSidebar/FunctionIcon';

export const Container = styled('div')(() => {
  return {
    overflowY: 'auto',
  };
});

export const AddButton = styled(FunctionIcon)(() => {
  return {};
});

export const DeleteAllButton = styled(FunctionIcon)(() => {
  return {};
});

export const ButtonsContainer = styled('div')(() => {
  return {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
  };
});
