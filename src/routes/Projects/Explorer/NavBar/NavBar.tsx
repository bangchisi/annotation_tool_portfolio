import { Link } from '@mui/material';
import { Container, Directory } from './NavBar.style';

export default function NavBar() {
  return (
    <Container>
      <Directory>
        <Link underline="hover">/</Link>
      </Directory>
    </Container>
  );
}
