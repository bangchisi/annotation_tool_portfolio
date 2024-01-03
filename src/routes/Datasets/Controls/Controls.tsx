import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import { Container, LeftControl } from './Controls.style';
import SearchPanel from './SearchPanel/SearchPanel';
// import Sort from './Sort/Sort';
import { DatasetType } from '../Datasets';
import { KeyedMutator } from 'swr';

interface ControlsProps {
  datasets: DatasetType[];
  updateDatasets: KeyedMutator<DatasetType[]>;
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
}

export default function Controls(props: ControlsProps) {
  const { datasets, updateDatasets, setFilteredDatasets } = props;
  return (
    <Container>
      <LeftControl>
        {/* <Sort /> */}
        <SearchPanel
          datasets={datasets}
          setFilteredDatasets={setFilteredDatasets}
        />
      </LeftControl>
      <CreateDatasetModal updateDatasets={updateDatasets} />
    </Container>
  );
}
