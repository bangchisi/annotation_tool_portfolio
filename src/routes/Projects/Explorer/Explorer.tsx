import { Container } from './Explorer.style';
import NavBar from './NavBar/NavBar';
import ProjectList from './ProjectList/ProjectList';

export default function Explorer() {
  return (
    <Container>
      <NavBar />
      <ProjectList />
    </Container>
  );
}
