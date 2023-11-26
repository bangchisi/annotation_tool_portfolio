import { Button } from '@mui/material';
import { Container } from './Sort.style';

export default function Sort() {
  return (
    <Container>
      <Button
        variant="contained"
        size="small"
        color="success"
        sx={{
          width: '85px',
          height: '40px',
          backgroundColor: '#1F883D',
        }}
      >
        Sort by
      </Button>
    </Container>
  );
}
