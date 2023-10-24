import { useEffect, useState } from 'react';
import {
  Container,
  TitleContainer,
  ImageContainer,
  StatusContainer,
  CategoriesContainer,
  MenuButtonContainer,
  ProgressContainer,
} from './DatasetCard.style';
import { getThumbnailPath } from 'helpers/ImagesHelpers';
import { LinearProgress, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import { Link } from 'react-router-dom';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetsModel from '../../models/Datasets.model';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import CategoryTag from 'components/CategoryTag/CategoryTag';
import { getDifferenceDate } from 'helpers/DateHelpers';
import DatasetMenu from './DatasetMenu/DatasetMenu';

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
    // created,
    lastUpdate,
    categories,
    progress,
    setDatasetList,
  } = props;
  const [imgPath, setImgPath] = useState('');

  const deleteDataset = async (userId: string, datasetId: number) => {
    try {
      await DatasetsModel.deleteDataset(datasetId);
      setDatasetList(userId);
    } catch (error) {
      axiosErrorHandler(error, `Failed to delete dataset (id: ${datasetId})`);
    }
  };

  useEffect(() => {
    getThumbnailPath(datasetId, 100).then((response) => {
      if (!response) return;
      setImgPath(response);
    });
  }, []);

  return (
    <Container>
      <ImageContainer>
        <Link to={'/dataset/' + datasetId}>
          <img src={imgPath} />
        </Link>
      </ImageContainer>
      <TitleContainer>
        <Link
          to={'/dataset/' + datasetId}
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <Typography variant="h5">{datasetName}</Typography>
        </Link>
        <div>
          created by{' '}
          <Typography variant="subtitle2" display="inline">
            {user.userName}
          </Typography>
        </div>
        {/* <Typography variant="subtitle1">{getFormattedDate(created)}</Typography> */}
        <Typography variant="subtitle2" display="inline" color="gray">
          update : {getDifferenceDate(lastUpdate)}
        </Typography>
      </TitleContainer>
      <StatusContainer>
        <CategoriesContainer>
          {categories.map((category) => {
            const textcolor = getTextColor(category.color);
            return (
              <CategoryTag
                key={category.categoryId + category.name}
                categoryName={category.name}
                categorycolor={category.color}
                textcolor={textcolor}
              />
            );
          })}
        </CategoriesContainer>
        <ProgressContainer>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="subtitle2" display="inline">
            {progress}%
          </Typography>
        </ProgressContainer>
      </StatusContainer>
      <MenuButtonContainer>
        <DatasetMenu
          userId={user.userId}
          datasetId={datasetId}
          deleteDataset={deleteDataset}
        />
      </MenuButtonContainer>
    </Container>
  );
}
