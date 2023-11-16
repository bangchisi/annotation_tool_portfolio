import { Breadcrumbs } from '@mui/material';
import { styled, Box } from '@mui/system';

export const Container = styled(Box)(() => {
  return {
    padding: 5,
    borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
  };
});

export const Directory = styled(Breadcrumbs)(() => {
  return {};
});
