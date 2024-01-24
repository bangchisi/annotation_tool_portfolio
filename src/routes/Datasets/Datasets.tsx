import { useState } from 'react';
import { useAppSelector } from 'App.hooks';
import { Container } from './Datasets.style';
import { useTypedSWR } from 'hooks';

import { Box, Button, Typography } from '@mui/material';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

import Controls from './Controls/Controls';
import DatasetList from './DatasetList/DatasetList';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export interface DatasetType {
  datasetId: number; // Dataset 고유 ID
  superDatasetName: string; // 대분류 이름
  datasetName: string; // Dataset 이름
  lastUpdate: string; // 마지막 변경시간
  created: string; // 생성 날짜
  description: string; // Dataset 설명
  numImages: number; // 이미지 갯수
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

// 목록을 불러오는데 오류가 발생하면 새로고침 하기 위한 버튼
const Reload = () => {
  return (
    <Box>
      <Typography>Dataset을 불러올 수 없습니다. 다시 시도 해주세요.</Typography>
      {/* TODO: Button onClick에 데이터를 다시 불러오는 mutation 추가하기 */}
      <Button color="info">
        <CachedOutlinedIcon />
        reload
      </Button>
    </Box>
  );
};

// Datasets 컴포넌트
export default function Datasets() {
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetType[]>([]); // 검색 결과를 담는 state
  const user = useAppSelector((state) => state.auth.user); // 현재 로그인한 유저 정보

  // Dataset 목록을 불러오는 SWR, mutate 함수를 통해 데이터 갱신 가능
  const { data, isLoading, error, mutate } = useTypedSWR<DatasetType[]>({
    method: 'get',
    endpoint: `/dataset/${user.userId}/datasets`,
  });

  // 에러 발생시 새로고침 버튼 출력
  if (error) {
    return <Reload />;
  }

  // 로딩 중이면 로딩 스피너 출력
  if (isLoading) {
    return (
      <LoadingSpinner message="Dataset 목록을 불러오는 중입니다. 잠시만 기다려주세요." />
    );
  }

  return (
    <>
      <Container id="datasets">
        {/* 데이터셋 검색 및 생성을 위한 컴포넌트 */}
        <Controls
          datasets={data || []}
          updateDatasets={mutate}
          setFilteredDatasets={setFilteredDatasets}
        />
        {/* 데이터셋 목록 컴포넌트 */}
        <DatasetList
          datasets={data || []}
          updateDatasets={mutate}
          filteredDatasets={filteredDatasets || []}
          setFilteredDatasets={setFilteredDatasets}
        />
      </Container>
    </>
  );
}
