import { useEffect } from 'react';
import DatasetCard from '../DatasetCard/DatasetCard';
import { Container } from './DatasetList.style';
import { useAppSelector } from 'App.hooks';
import { DatasetType } from '../Datasets';

interface DatasetListProps {
  datasets: DatasetType[];
  setDatasetList: (userId: string) => Promise<void>;
}

export default function DatasetList(props: DatasetListProps) {
  const user = useAppSelector((state) => state.auth.user);

  const { datasets, setDatasetList } = props;

  useEffect(() => {
    setDatasetList(user.userId);
  }, []);

  return (
    <Container>
      {datasets.map((dataset) => {
        return <DatasetCard key={dataset.datasetId} {...dataset} />;
      })}
    </Container>
  );
}
