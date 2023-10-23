import { useParams } from 'react-router-dom';
import { Container } from './Dataset.style';
import ImageList from './ImageList/ImageList';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetModel from './models/Dataset.model';
import { Fragment, useEffect, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Information from './Information/Information';
import Controls from './Controls/Controls';
import PaginationPanel from 'components/PaginationPanel/PaginationPanel';

export interface DatasetType {
  datasetId: number;
  datasetName: string;
  lastUpdate: string;
  created: string;
  description: string;
  directory: string;
  categories: CategoryType[];
  numImages: number;
  numPages: number;
  imageIds: number[][];
}

interface CategoryType {
  categoryId: number;
  name: string;
  color: string;
  superCategory: string;
}

export default function Dataset() {
  const [dataset, setDataset] = useState<DatasetType>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetId = useParams().datasetId;

  const getDataset = async (datasetId: number | undefined) => {
    try {
      setIsLoading(true);
      const response = await DatasetModel.getDatasetById(datasetId);
      const dataset = response.data.data;
      console.log('Dataset.tsx, dataset: ');
      console.dir(dataset);
      setDataset(dataset);
      return dataset;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get dataset information.');
    } finally {
      setIsLoading(false);
    }
  };

  const onCurrentpageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!datasetId) return;
    getDataset(Number(datasetId));
  }, []);

  // TODO: dataset 정보를 Information 전달
  // TODO: dataset.imageIds를 ImageList에 전달
  // TODO: descripttion에서 category 편집 가능하게

  return (
    <Container>
      <Controls />
      {dataset && (
        <Fragment>
          <Information {...dataset} />
          <div id="contents">
            <PaginationPanel
              onCurrentPageChange={onCurrentpageChange}
              currentPage={currentPage}
              lastPage={dataset.imageIds.length}
            />
            <ImageList imageIds={dataset.imageIds[currentPage - 1]} />)
          </div>
        </Fragment>
      )}
      {isLoading && (
        <LoadingSpinner message="Dataset 정보를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
