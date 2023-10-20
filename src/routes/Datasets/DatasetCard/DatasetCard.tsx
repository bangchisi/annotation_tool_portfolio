import { useEffect, useState } from 'react';
import { DatasetType } from '../Datasets';
import {
  Container,
  TitleContainer,
  ImageContainer,
  StatusContainer,
  CategoriesContainer,
  ProgressContainer,
  MenuButtonContainer,
} from './DatasetCard.style';
import { getThumbnail } from 'helpers/ImagesHelpers';
import { Button, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import { Link } from 'react-router-dom';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetsModel from '../models/Datasets.model';

interface DatasetCardProps {
  datasetId: number; // Dataset 고유 ID
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
  setDatasetList: (userId: string) => Promise<void>;
}

export default function DatasetCard(props: DatasetCardProps) {
  const user = useAppSelector((state) => state.auth.user);
  const {
    datasetId,
    datasetName,
    created,
    lastUpdate,
    categories,
    progress,
    setDatasetList,
  } = props;
  const [imgPath, setImgPath] = useState('');

  const deleteDataset = async (datasetId: number) => {
    try {
      const response = await DatasetsModel.deleteDataset(datasetId);
      setDatasetList(user.userId);
    } catch (error) {
      axiosErrorHandler(error, `Failed to delete dataset (id: ${datasetId})`);
    }
  };

  useEffect(() => {
    // setThumbnail(datasetId, 200);
    getThumbnail(datasetId, 200).then((response) => {
      if (!response) return;
      setImgPath(response);
    });
  }, [datasetId]);

  return (
    <Container>
      <ImageContainer>
        <Link to={'/dataset/' + datasetId}>
          <img src={imgPath} />
        </Link>
      </ImageContainer>
      <TitleContainer>
        <Link to={'/dataset/' + datasetId}>
          <Typography variant="h5">{datasetName}</Typography>
        </Link>
        <div>created by {user.userName}</div>
        <div>{created}</div>
        <div>update: {lastUpdate}</div>
      </TitleContainer>
      <StatusContainer>
        <CategoriesContainer>
          {categories.map((category) => (
            <button key={category.categoryId}>{category.name}</button>
          ))}
        </CategoriesContainer>
        <ProgressContainer>{progress}</ProgressContainer>
      </StatusContainer>
      <MenuButtonContainer>
        <Button variant="text">...</Button>
        <Button
          variant="text"
          color="warning"
          onClick={() => deleteDataset(datasetId)}
        >
          Delete
        </Button>
      </MenuButtonContainer>
    </Container>
  );
}
