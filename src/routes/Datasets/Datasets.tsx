import { useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useState } from 'react';
import Reload from 'routes/Datasets/Reload/Reload';
import Controls from './Controls/Controls';
import DatasetList from './DatasetList/DatasetList';
import { Container } from './Datasets.style';
import DatasetsModel from './models/Datasets.model';
import { OnboardingButton } from 'hooks/useOnboarding';

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

  if (isError) {
    return <Reload setDatasetList={setDatasetList} userId={user.userId} />;
  }

  return (
    <>
      {isLoading && (
        <LoadingSpinner message="Dataset 목록을 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
      <OnboardingButton />
      <Container id="datasets">
        <Controls
          datasets={datasets}
          setFilteredDatasets={setFilteredDatasets}
          setDatasetList={setDatasetList}
        />
        <DatasetList
          datasets={datasets}
          filteredDatasets={filteredDatasets || []}
          setFilteredDatasets={setFilteredDatasets}
          setDatasetList={setDatasetList}
        />
      </Container>
    </>
  );
}
