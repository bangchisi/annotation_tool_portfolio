import { styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 5,
    width: '200px',
    height: 'auto', // made this '275px' to 'auto'
    border: '2px solid rgba(0, 0, 0, 0.3)',
    boxShadow: 'rgba(136, 146, 157, 0.15) 0px 3px 6px 0px',
    borderRadius: '6px',
    transition: 'all 0.25s ease-in-out',
    '&:hover': {
      boxShadow: 'rgba(136, 146, 157, 0.4) 0px 3px 7px 4px',
    },
    '& a': {
      textDecoration: 'none',
      color: '#0e1116',
      fontWeight: 500,
    },
  };
});

// <NavLink> to <ImageLink>
export const ImageLink = styled(NavLink)(() => {
  return {
    width: '100%',
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '180px',
    height: '200px',
    backgroundColor: 'black',
    overflow: 'hidden',

    '&:hover img': {
      transition: 'transform 0.15s ease-in-out',
      transform: 'scale(1) !important',
    },
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '4px',
  };
});

// <span> to <Title>
export const Title = styled('span')(() => {
  return {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 500,

    '&:hover': {
      width: '100%',
      overflow: 'visible',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
  };
});
