import { Typography, styled } from '@mui/material';

interface TabButtonProps {
  'data-selected': boolean;
}

export const Container = styled('div')(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '50%',
    overflowY: 'scroll',
    marginRight: '-17px',
  };
});

export const TabContainer = styled('div')(() => {
  return {
    display: 'flex',
    borderBottom: '1px solid #20252c',
  };
});

export const TabButton = styled(Typography)<TabButtonProps>((props) => {
  const selected = props['data-selected'];

  return {
    display: 'inline-flex',
    backgroundColor: selected ? '#E7ECF0' : 'none',
    color: selected ? '#0e1116' : 'rgb(0, 0, 0, 0.7)',
    cursor: 'pointer',
    padding: '3px 5px',
    flexBasis: '50%',

    '&:nth-of-type(2n-1)': {
      borderRight: '1px solid #20252c',
    },
  };
});
