import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    width: '90%',
    display: 'flex',
    border: '2px solid rgba(0, 0, 0, 0.3)',
    margin: '0 auto',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'space-between',
    flexDirection: 'row',
    boxShadow: 'rgba(136, 146, 157, 0.15) 0px 3px 6px 0px',
    borderRadius: '6px',
    height: '175px !important',
    flexShrink: '1',
    gap: '16px',
    padding: '10px',
    transition: 'all 0.15s ease-in-out',
    overflow: 'hidden',

    '&:hover': {
      boxShadow: 'rgba(136, 146, 157, 0.25) 0px 3px 6px 3px',
    },
  };
});

export const ImageContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: '0 0 !important',
    flexBasis: '115px !important',

    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100px',
      height: '100px',
      backgroundColor: 'black',
    },
    '& img': {
      objectFit: 'contain',
    },
    '& img.no-image': {
      boxShadow: 'rgba(136, 146, 157, 0.35) 0px 2px 5px 0px',
    },
  };
});

export const TitleStatusContainer = styled('div')(() => {
  return {
    display: 'flex',
    flex: '1 !important',
    justifyContent: 'space-between',
    gap: '16px',
  };
});

export const TitleContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexBasis: '35%',
    flexShrink: '0',
    minWidth: '165px',
  };
});

export const MetaDataTitle = styled('div')(() => {
  return {
    display: 'flex',
    marginTop: '12px',
    height: '64px',
  };
});

export const MetaDataBody = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',

    '& div': {
      fontSize: '13px !important',
    },
  };
});

export const CreatedAt = styled('div')(() => {
  return {
    //
  };
});

export const UpdatedAt = styled('div')(() => {
  return {
    display: 'flex',
  };
});

export const StatusContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: '1',
  };
});

export const CategoriesContainerScrollbarWindow = styled('div')(() => {
  return {
    overflow: 'hidden',
  };
});

export const CategoriesContainer = styled('div')(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'auto',
    userSelect: 'none',
    fontSize: '13px',
  };
});

export const CategoriesPadding = styled('div')(() => {
  return {
    display: 'flex',
    height: '27px',
  };
});

export const ProgressContainer = styled('div')(() => {
  return {};
});

export const MenuButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    flexBasis: '32px',
  };
});
