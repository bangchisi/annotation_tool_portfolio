import Controls from './Controls/Controls';
import Explorer from './Explorer/Explorer';
import { Container } from './Projects.style';

export default function Projects() {
  return (
    <Container>
      <Controls />
      <Explorer />
    </Container>
  );
}
