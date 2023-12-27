import { Container } from './RightSidebar.style';
import Controls from './Controls/Controls';
import Preferences from './Preferences/Preferences';
import { KeyedMutator } from 'swr';
import { InitDataType } from 'routes/Annotator/Annotator';
// import Minimap from './Minimap/Minimap';

type RightSidebarProps = {
  reload: KeyedMutator<InitDataType>;
};

export default function RightSidebar(props: RightSidebarProps) {
  return (
    <Container>
      <Controls />
      <Preferences reload={props.reload} />
      {/* <Minimap view={null} image={null} /> */}
    </Container>
  );
}
