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
          backgroundColor: '#00AA55',
          boxShadow: 'none',
          borderRadius: '3',
          transition: 'all 0.25s ease-in-out',
          fontSize: '12px',
        }}
        disableFocusRipple={true}
      >
        Sort by
      </Button>
    </Container>
  );
}
