import { useAppDispatch, useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import PaginationPanel from 'components/PaginationPanel/PaginationPanel';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { debounce } from 'lodash';
import ImagesModel from 'models/Images.model';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setTool } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';
import Controls from './Controls/Controls';
import { Container, Content } from './Dataset.style';
import ImageList from './ImageList/ImageList';
import Information from './Information/Information';
// import { getIsOnTrain } from './helpers/DatasetHelpers';
import { useTypedSWR } from 'hooks';
import { LogType } from 'routes/Models/logTypes';

export interface DatasetType {
  superDatasetName: string;
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

export interface CategoryType {
  categoryId: number;
  name: string;
  color: string;
  superCategory: string;
}

export default function Dataset() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetId = Number(useParams().datasetId);
  const dispatch = useAppDispatch();
  const [isOnTrain, setIsOnTrain] = useState(false);

  const { data, isLoading, error, mutate } = useTypedSWR<DatasetType>(
    'get',
    `/dataset/${datasetId}`,
  );

  const { data: finetuneList } = useTypedSWR<LogType[]>(
    'get',
    `/finetune/${userId}`,
  );

  if (error) {
    console.log('Dataset.tsx error');
    console.dir(error);
  }

  if (isLoading)
    <LoadingSpinner message="데이터셋을 불러오는 중입니다. 잠시만 기다려주세요." />;

  // @리팩토링: Datasets 페이지에서 category를 상태로 저장하지 않기 때문에
  // category가 삭제되면 dataset을 다시 불러와야 함
  const handleCategoryDeleted = () => {
    mutate();
  };

  const handleCategoryAdded = () => {
    mutate();
  };

  async function deleteImage(imageId: number) {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;
    try {
      const response = await ImagesModel.deleteImage(imageId);

      if (response.status !== 200) {
        throw new Error('Failed to delete image');
      }

      mutate();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete image');
    }
  }

  const onCurrentpageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!datasetId) return;
    dispatch(setTool(Tool.Select));
    mutate();
  }, [datasetId, dispatch, mutate]);

  useEffect(() => {
    const log = finetuneList?.find(
      (log) => log.datasetId === datasetId && !log.isDone,
    );

    if (!log) setIsOnTrain(false);
    else setIsOnTrain(true);
  }, [finetuneList, datasetId, setIsOnTrain]);

  const isImageListEmpty = useMemo(() => {
    if (!data) {
      return true;
    }

    if (
      currentPage === 1 &&
      data.imageIds.length === 0 &&
      data.imageIds.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [data, currentPage]);

  const [hasScroll, setHasScroll] = useState(false);
  useEffect(() => {
    const detectScroll = () => {
      const { scrollHeight } = document.body;
      const viewportHeight = window.innerHeight;

      if (scrollHeight > viewportHeight) {
        setHasScroll(true);
      } else {
        setHasScroll(false);
      }
    };

    detectScroll();

    const debounceDetectScroll = debounce(detectScroll, 50);
    window.addEventListener('resize', debounceDetectScroll);
    return () => {
      window.removeEventListener('resize', debounceDetectScroll);
    };
  }, [data, data?.imageIds]);

  return (
    <Container id="dataset">
      <Controls
        isOnTrain={isOnTrain}
        setIsOnTrain={setIsOnTrain}
        reload={mutate}
      />
      {data && (
        <>
          <Information
            {...data}
            handleCategoryDeleted={handleCategoryDeleted}
            handleCategoryAdded={handleCategoryAdded}
            isOnTrain={isOnTrain}
            reload={mutate}
          />
          <Content>
            {!isImageListEmpty && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={data.imageIds.length}
              />
            )}
            <ImageList
              imageIds={data.imageIds[currentPage - 1]}
              deleteImage={deleteImage}
              isOnTrain={isOnTrain}
            />
            {!isImageListEmpty && hasScroll && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={data.imageIds.length}
              />
            )}
          </Content>
        </>
      )}
    </Container>
  );
}
