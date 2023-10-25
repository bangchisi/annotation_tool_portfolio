import { Typography, styled } from '@mui/material';

interface TabButtonProps {
  'data-selected': boolean;
}

export const Container = styled('div')(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50%',
    maxHeight: '50%',
  };
});

export const TabContainer = styled('div')(() => {
  return {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
  };
});

export const TabButton = styled(Typography)<TabButtonProps>((props) => {
  const selected = props['data-selected'];

  return {
    display: 'inline',
    // backgroundColor: selected ? 'rgb(25, 118, 210, 0.9)' : 'none',
    backgroundColor: selected ? 'rgb(0, 0, 0, 0.5)' : 'none',
    // color: selected ? 'rgba(255, 255, 255, 1)' : 'rgb(25, 118, 210, 0.9)',
    color: selected ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0, 0.7)',
    cursor: 'pointer',
    padding: '5px',
  };
});
