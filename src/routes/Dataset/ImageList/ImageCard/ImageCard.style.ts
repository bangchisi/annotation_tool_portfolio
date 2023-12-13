import { styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

export const Wrapper = styled('div')(() => {
  return {
    width: '200px',
    height: '275px',
  };
});

export const ImageContainerPadding = styled('div')(() => {
  return {
    //
  };
});

export const Container = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: '5px 5px 3px 5px',
    width: '200px',
    height: '275px',
    border: '2px solid var(--border-color)',
    boxShadow: 'rgba(136, 146, 157, 0.15) 0px 3px 6px 0px',
    borderRadius: '6px',
    marginBottom: '12px',
    transition: 'all 0.25s ease-in-out',
    position: 'absolute',
    // 컨테이너 자체 스타일
    '&:hover': {
      boxShadow: 'rgba(136, 146, 157, 0.3) 2px 2px 6px 3px',
    },

    // 링크 관련
    '& a': {
      textDecoration: 'none',
      color: '#0e1116',
      fontWeight: 500,
    },

    // 이미지 관련
    '&:hover img': {
      transition: 'transform 0.15s ease-in-out',
      transform: 'scale(1) !important',
    },

    // 이미지 타이틀 관련
    '&:hover:has(.image-title.clipped)': {
      height: '285px',
    },
    '&:hover .image-title-container:has(.image-title.clipped)': {
      height: '39px',
      transition: 'all 0.15s ease-in-out',
    },
    '&:hover .image-title.clipped': {
      wordBreak: 'break-all',
      whiteSpace: 'break-spaces',
    },
  };
});

export const ImageLink = styled(NavLink)(() => {
  return {
    width: '100%',
    height: '100%',
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '200px',
    backgroundColor: 'black',
    overflow: 'hidden',
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    display: 'flex',
    marginTop: '2px',
    height: '19.5px',
    width: '100%',
  };
});

export const Title = styled('span')(() => {
  return {
    display: 'inline-block',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    fontSize: '13px',
    fontWeight: 500,
  };
});
