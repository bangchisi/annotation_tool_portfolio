import { Button } from '@mui/material';
import Explorer from './Explorer/Explorer';
import { Container, TabContainer } from './Controls.style';
import Annotations from './Annotations/Annotations';

export default function Controls() {
  return (
    <Container>
      <TabContainer>
        <Button variant="text">Annotations</Button>
        <Button variant="text">Explorer</Button>
      </TabContainer>
      <Annotations />
      <Explorer />
    </Container>
  );
}
