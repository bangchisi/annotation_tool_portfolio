import { styled } from '@mui/material';

interface CategoryTagProps {
  categorycolor: string;
  textcolor: string;
}

export const Container = styled('button')<CategoryTagProps>(({
  categorycolor,
  textcolor,
}) => {
  return {
    backgroundColor: categorycolor,
    color: textcolor,
    border: 'none',
    borderRadius: 7,
    margin: '2px 5px',
  };
});
