import { Box, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    padding: '45px 80px',
  };
});

export const TableWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 1rem;
  border: none;
`;
