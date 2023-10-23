import { AppBar, styled } from '@mui/material';
import { Link } from 'react-router-dom';

interface LinkProps {
  'data-selected': boolean;
}

export const Container = styled(AppBar)(() => {
  return {
    display: 'flex',
  };
});

export const LinkContainer = styled('div')(() => {
  return {};
});

export const NavigatorLink = styled(Link)<LinkProps>((props) => {
  const selected = props['data-selected'];
  return {
    fontWeight: selected ? 'bold' : 'normal',
  };
});
