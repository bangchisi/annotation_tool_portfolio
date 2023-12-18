import { styled } from '@mui/material';

export const Container = styled('div')(() => {
  return {
    backgroundColor: 'var(--editor-bg)',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  };
});
