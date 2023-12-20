import CreateDatasetModal from './CreateDatasetModal/CreateDatasetModal';
import { Container, LeftControl } from './Controls.style';
import SearchPanel from './SearchPanel/SearchPanel';
// import Sort from './Sort/Sort';
import { DatasetType } from '../Datasets';

interface ControlsProps {
  datasets: DatasetType[];
  setFilteredDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
  setDatasetList: (userId: string) => Promise<void>;
}

export default function Controls(props: ControlsProps) {
  const { datasets, setFilteredDatasets, setDatasetList } = props;
  return (
    <Container>
      <LeftControl>
        {/* <Sort /> */}
        <SearchPanel
          datasets={datasets}
          setFilteredDatasets={setFilteredDatasets}
        />
      </LeftControl>
      <CreateDatasetModal setDatasetList={setDatasetList} />
    </Container>
  );
}
