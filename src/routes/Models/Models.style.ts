import { Box, styled } from '@mui/material';

export const Container = styled(Box)(() => {
  return {
    margin: '42px 64px',
  };
});

export const TableWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 1rem;
  border: none;
`;

export const QueueBox = styled('div')`
  h3 {
    display: flex;
    margin: 24px 18px 18px;
    font-size: 36px;
  }
`;
