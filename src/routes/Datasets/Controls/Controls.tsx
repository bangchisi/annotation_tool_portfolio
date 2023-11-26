import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import { Container, LeftControl } from './Controls.style';
import SearchPanel from './SearchPanel/SearchPanel';
import Sort from './Sort/Sort';

interface ControlsProps {
  setDatasetList: (userId: string) => Promise<void>;
}

export default function Controls(props: ControlsProps) {
  const { setDatasetList } = props;
  return (
    <Container>
      <LeftControl>
        <Sort />
        <SearchPanel />
      </LeftControl>
      <CreateDatasetModal setDatasetList={setDatasetList} />
    </Container>
  );
}
