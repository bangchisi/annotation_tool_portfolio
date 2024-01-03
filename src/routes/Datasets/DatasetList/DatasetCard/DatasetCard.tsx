import { LinearProgress, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import axios, { AxiosError } from 'axios';
import CategoryTag from 'components/CategoryTag/CategoryTag';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import { getDifferenceDate } from 'helpers/DateHelpers';
import { Link } from 'react-router-dom';
import {
  CategoriesContainer,
  CategoriesPadding,
  Container,
  CreatedAt,
  ImageContainer,
  MenuButtonContainer,
  MetaDataBody,
  MetaDataTitle,
  ProgressContainer,
  StatusContainer,
  TitleContainer,
  TitleStatusContainer,
  UpdatedAt,
} from './DatasetCard.style';
import DatasetMenu from './DatasetMenu/DatasetMenu';
import { DatasetType } from 'routes/Datasets/Datasets';
import useSWR, { KeyedMutator } from 'swr';
import { useRef } from 'react';

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
  updateDatasets: KeyedMutator<DatasetType[]>;
  setExportId: React.Dispatch<React.SetStateAction<number | undefined>>;
  handleOpen: () => void;
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
    updateDatasets,
    setExportId,
    handleOpen,
  } = props;

  const imgPath = useRef(
    `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/image/thumbnail/${datasetId}?length=100`,
  );

  const { error } = useSWR(imgPath.current, (url: string) => {
    return axios.get(url);
  });

  if (error) {
    imgPath.current = '/no_image.png';
  }

  const deleteDataset = async (userId: string, datasetId: number) => {
    const confirmDelete = confirm('Dataset을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await typedAxios('DELETE', `/dataset/${datasetId}`);

      if (response.status === 400) {
        alert('현재 학습중인 Dataset은 삭제할 수 없습니다.');
        return;
      }

      if (response.status !== 200) {
        alert('Failed to delete dataset.');
        return;
      }

      updateDatasets();
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        alert('현재 학습중인 Dataset은 삭제할 수 없습니다.');
        return;
      }
      axiosErrorHandler(error, `Failed to delete dataset (id: ${datasetId})`);
    }
  };

  return (
    <Container className="dataset-card">
      <ImageContainer>
        <Link to={'/dataset/' + datasetId}>
          <img
            src={imgPath.current}
            className={
              imgPath.current.includes('no_image') ? 'no-image' : undefined
            }
          />
        </Link>
      </ImageContainer>
      <TitleStatusContainer>
        <TitleContainer className="meta-data">
          <MetaDataTitle>
            <Link
              to={'/dataset/' + datasetId}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <Typography
                variant="h5"
                className="title"
                sx={{
                  color: '#0e1116',
                }}
              >
                {datasetName}
              </Typography>
            </Link>
          </MetaDataTitle>
          <MetaDataBody>
            <CreatedAt>
              created by{' '}
              <Typography variant="subtitle2" display="inline">
                {user.userName}
              </Typography>
            </CreatedAt>
            <UpdatedAt>
              <pre>update: </pre>
              <Typography variant="subtitle2" display="inline" color="gray">
                {getDifferenceDate(lastUpdate)}
              </Typography>
            </UpdatedAt>
          </MetaDataBody>
        </TitleContainer>
        <StatusContainer>
          <CategoriesContainer className="meta-data-categories">
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
            {categories.length <= 0 && (
              <CategoriesPadding className="categories-padding" />
            )}
          </CategoriesContainer>
          <ProgressContainer>
            <LinearProgress
              sx={{ my: 1, height: '8px', borderRadius: '3px' }}
              variant="determinate"
              value={progress * 100}
            />
            <Typography variant="subtitle2" display="inline">
              {Math.round(progress * 100)}% done
            </Typography>
          </ProgressContainer>
        </StatusContainer>
      </TitleStatusContainer>
      <MenuButtonContainer>
        <DatasetMenu
          userId={user.userId}
          datasetId={datasetId}
          deleteDataset={deleteDataset}
          setExportId={setExportId}
          handleOpen={handleOpen}
        />
      </MenuButtonContainer>
    </Container>
  );
}
