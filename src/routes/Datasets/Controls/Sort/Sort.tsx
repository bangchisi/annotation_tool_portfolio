import { Button } from '@mui/material';
import { Container } from './Sort.style';

export default function Sort() {
  return (
    <Container>
      <Button variant="contained" size="small" color="success">
        Sort by
      </Button>
    </Container>
  );
}
