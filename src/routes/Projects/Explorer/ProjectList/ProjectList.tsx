import Project from './Project/Project';
import { Container } from './ProjectList.style';

export default function ProjectList() {
  return (
    <Container>
      <Project projectName={'IVF'} />
      <Project projectName={'TBNK'} />
      <Project projectName={'Bacteria'} />
    </Container>
  );
}
