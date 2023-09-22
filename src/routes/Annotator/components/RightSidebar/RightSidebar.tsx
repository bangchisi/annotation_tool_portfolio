import { Container } from './RightSidebar.style';
import Controls from './Controls/Controls';
import Preferences from './Preferences/Preferences';
import Minimap from './Minimap/Minimap';
import { AnnotationType } from 'routes/Annotator/Annotator.types';

interface RightSidebarProps {
  annotations: AnnotationType[];
  onAnnotationsChange: React.Dispatch<React.SetStateAction<AnnotationType[]>>;
}

export default function RightSidebar({
  annotations,
  onAnnotationsChange,
}: RightSidebarProps) {
  return (
    <Container>
      <Controls
        annotations={annotations}
        onAnnotationsChange={onAnnotationsChange}
      />
      <Preferences />
      <Minimap view={null} image={null} />
    </Container>
  );
}
