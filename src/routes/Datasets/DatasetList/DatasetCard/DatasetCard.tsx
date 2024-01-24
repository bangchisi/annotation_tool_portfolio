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

// DatasetCard 컴포넌트 props 타입
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
  updateDatasets: KeyedMutator<DatasetType[]>; // DatasetList 업데이트 함수
  setExportId: React.Dispatch<React.SetStateAction<number | undefined>>; // 내보내기를 위한 Dataset id 업데이트 함수
  handleOpen: () => void; // 내보내기 모달 활성화 함수
}

// DatasetCard 컴포넌트
export default function DatasetCard(props: DatasetCardProps) {
  const user = useAppSelector((state) => state.auth.user); // 로그인한 사용자 정보
  // props 디스트럭처링
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

  // Dataset 썸네일 이미지 경로
  const imgPath = useRef(
    `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/image/thumbnail/${datasetId}?length=100`,
  );

  // Dataset 썸네일 이미지 경로를 이용해 이미지 요청
  const { error } = useSWR(imgPath.current, (url: string) => {
    return axios.get(url);
  });

  // 이미지 요청이 실패하면 no_image.png로 설정
  if (error) {
    imgPath.current = '/no_image.png';
  }

  // Dataset 삭제 함수
  const deleteDataset = async (userId: string, datasetId: number) => {
    // 삭제 확인
    const confirmDelete = confirm('Dataset을 삭제하시겠습니까?');
    // 취소하면 종료
    if (!confirmDelete) return;

    try {
      // Dataset 삭제 요청
      const response = await typedAxios('DELETE', `/dataset/${datasetId}`);

      // 400 에러면 종료
      if (response.status === 400) {
        alert('현재 학습중인 Dataset은 삭제할 수 없습니다.');
        return;
      }

      // 200 응답이 아니면 종료
      if (response.status !== 200) {
        alert('Failed to delete dataset.');
        return;
      }

      // DatasetList 업데이트
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
      {/* Dataset 썸네일 이미지 */}
      <ImageContainer>
        {/* 이미지에 링크 설정 */}
        <Link to={'/dataset/' + datasetId}>
          {/* 이미지 렌더링 */}
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
          {/* 데이터셋 이름 */}
          <MetaDataTitle>
            {/* 데이터셋 이름에 링크 설정 */}
            <Link
              to={'/dataset/' + datasetId}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              {/* 데이터셋 이름 렌더링 */}
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
          {/* 데이터셋 생성자, 업데이트 시간 */}
          <MetaDataBody>
            {/* 데이터셋 생성자 */}
            <CreatedAt>
              created by{' '}
              <Typography variant="subtitle2" display="inline">
                {user.userName}
              </Typography>
            </CreatedAt>
            {/* 데이터셋 업데이트 시간 */}
            <UpdatedAt>
              <pre>update: </pre>
              <Typography variant="subtitle2" display="inline" color="gray">
                {getDifferenceDate(lastUpdate)}
              </Typography>
            </UpdatedAt>
          </MetaDataBody>
        </TitleContainer>
        <StatusContainer>
          {/* 데이터셋 카테고리 목록 */}
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
          {/* 데이터셋 진행률 */}
          <ProgressContainer>
            {/* progress bar */}
            <LinearProgress
              sx={{ my: 1, height: '8px', borderRadius: '3px' }}
              variant="determinate"
              value={progress * 100}
            />
            {/* 진행률 텍스트 */}
            <Typography variant="subtitle2" display="inline">
              {Math.round(progress * 100)}% done
            </Typography>
          </ProgressContainer>
        </StatusContainer>
      </TitleStatusContainer>
      {/* Dataset 메뉴 버튼 */}
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
