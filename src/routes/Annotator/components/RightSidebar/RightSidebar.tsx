import { Container } from './RightSidebar.style';
import Controls from './Controls/Controls';
import Preferences from './Preferences/Preferences';
import Minimap from './Minimap/Minimap';

export default function RightSidebar() {
  return (
    <Container>
      <Controls />
      <Preferences />
      <Minimap view={null} image={null} />
    </Container>
  );
}
