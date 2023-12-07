import DatasetList from './DatasetList/DatasetList';
import { useEffect, useState } from 'react';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetsModel from './models/Datasets.model';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { Container } from './Datasets.style';
import Controls from './Controls/Controls';
import Reload from './Reload/Reload';
import { useAppSelector } from 'App.hooks';

export interface DatasetType {
  datasetId: number; // Dataset 고유 ID
  superDatasetName: string;
  datasetName: string; // Dataset 이름. 중복 가능?
  lastUpdate: string; // 마지막 변경시간. or Date
  created: string; // 생성 날짜. or Date
  description: string;
  numImages: number; // 이미지 갯수?
  progress: number; // annotation 진행률
  categories: [
    {
      categoryId: number; // category 고유 ID
      name: string; // category 이름
      color: string; // category 색깔
      supercategory: string; // 상위 카테고리
    },
  ];
}

export default function Datasets() {
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const setDatasetList = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await DatasetsModel.getDatasetsByUserId(userId);
      const datasetList = response.data;
      setDatasets([...datasetList]);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      axiosErrorHandler(error, 'Failed to get datasets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setDatasetList(user.userId);
  }, []);

  // TODO: style dataset-search
  return (
    <Container id="datasets">
      <Controls
        datasets={datasets}
        setFilteredDatasets={setFilteredDatasets}
        setDatasetList={setDatasetList}
      />
      {!isError && (
        <DatasetList
          datasets={datasets}
          filteredDatasets={filteredDatasets || []}
          setFilteredDatasets={setFilteredDatasets}
          setDatasetList={setDatasetList}
        />
      )}
      {isError && (
        <Reload setDatasetList={setDatasetList} userId={user.userId} />
      )}
      {isLoading && (
        <LoadingSpinner message="Dataset 목록을 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
