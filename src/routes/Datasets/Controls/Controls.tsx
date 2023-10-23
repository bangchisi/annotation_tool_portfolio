import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import { Container } from './Controls.style';
import SearchPanel from './SearchPanel/SearchPanel';
import Sort from './Sort/Sort';

interface ControlsProps {
  setDatasetList: (userId: string) => Promise<void>;
}

export default function Controls(props: ControlsProps) {
  const { setDatasetList } = props;
  return (
    <Container>
      <Sort />
      <SearchPanel />
      <CreateDatasetModal setDatasetList={setDatasetList} />
    </Container>
  );
}
