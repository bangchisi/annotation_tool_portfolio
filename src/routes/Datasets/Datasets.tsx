import { useEffect, useState } from 'react';
import { useAppSelector } from 'App.hooks';
import { Container } from './Datasets.style';
import { useEnhancedSWR } from 'hooks';

import { Box, Button, Typography } from '@mui/material';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

import Controls from './Controls/Controls';
import DatasetList from './DatasetList/DatasetList';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

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

const Reload = () => {
  return (
    <Box>
      <Typography>Dataset을 불러올 수 없습니다. 다시 시도 해주세요.</Typography>
      <Button color="info">
        <CachedOutlinedIcon />
        reload
      </Button>
    </Box>
  );
};

export default function Datasets() {
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetType[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading, isError, mutate } = useEnhancedSWR<DatasetType[]>(
    'GET',
    `/dataset/${user.userId}/datasets`,
  );

  useEffect(() => {
    if (data) {
      setDatasets(data);
    }
  }, [data]);

  if (isError) {
    return <Reload />;
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="Dataset 목록을 불러오는 중입니다. 잠시만 기다려주세요." />
    );
  }

  return (
    <>
      <Container id="datasets">
        <Controls
          datasets={datasets}
          updateDatasets={mutate}
          setFilteredDatasets={setFilteredDatasets}
        />
        <DatasetList
          datasets={datasets}
          updateDatasets={mutate}
          filteredDatasets={filteredDatasets || []}
          setFilteredDatasets={setFilteredDatasets}
        />
      </Container>
    </>
  );
}
