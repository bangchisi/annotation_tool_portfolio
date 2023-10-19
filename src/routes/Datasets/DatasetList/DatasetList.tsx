import { useEffect, useState } from 'react';
import DatasetCard from '../DatasetCard/DatasetCard';
import { Container } from './DatasetList.style';
import DatasetsModel from '../models/Datasets.model';
import { useAppSelector } from 'App.hooks';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { DatasetType } from '../Datasets';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export default function DatasetList() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const [datasets, setDatasets] = useState<DatasetType[]>([]);

  const setDatasetList = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await DatasetsModel.getDatasetsByUserId(userId);
      const datasetList = response.data.data;
      setDatasets([...datasetList]);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get datasets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDatasetList(user.userId);
  }, []);

  return (
    <Container>
      {datasets.map((dataset) => {
        return <DatasetCard key={dataset.datasetId} {...dataset} />;
      })}
      {isLoading && <LoadingSpinner />}
    </Container>
  );
}
