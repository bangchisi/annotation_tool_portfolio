import { useAppDispatch, useAppSelector } from 'App.hooks';
import PaginationPanel from 'components/PaginationPanel/PaginationPanel';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import ImagesModel from 'models/Images.model';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tool } from 'routes/Annotator/Annotator';
import { setTool } from 'routes/Annotator/slices/annotatorSlice';
import Controls from './Controls/Controls';
import { Container, Content } from './Dataset.style';
import ImageList from './ImageList/ImageList';
import Information from './Information/Information';
import { getIsOnTrain } from './helpers/DatasetHelpers';
import DatasetModel from './models/Dataset.model';

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

export interface CategoryType {
  categoryId: number;
  name: string;
  color: string;
  superCategory: string;
}

export default function Dataset() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const [dataset, setDataset] = useState<DatasetType>();
  const [availableDevices, setAvailableDevices] = useState<{
    [key: string]: boolean;
  }>();
  const [isDeviceLoading, setIsDeviceLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const datasetId = Number(useParams().datasetId);
  const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const dispatch = useAppDispatch();
  const [isOnTrain, setIsOnTrain] = useState(false);

  const getDataset = async (datasetId: number | undefined) => {
    try {
      setIsLoading(true);
      const response = await DatasetModel.getDatasetById(datasetId);
      const dataset = response.data;

      setDataset(dataset);
      return dataset;
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get dataset information.');
    } finally {
      setIsLoading(false);
    }
  };

  // @리팩토링: Datasets 페이지에서 category를 상태로 저장하지 않기 때문에
  // category가 삭제되면 dataset을 다시 불러와야 함
  const handleCategoryDeleted = () => {
    getDataset(datasetId);
  };

  const handleCategoryAdded = () => {
    getDataset(datasetId);
  };

  async function deleteImage(imageId: number) {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;
    try {
      const response = await ImagesModel.deleteImage(imageId);

      if (response.status !== 200) {
        throw new Error('Failed to delete image');
      }

      getDataset(datasetId);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete image');
    }
  }

  async function setDeviceStatus() {
    setIsDeviceLoading(true);
    try {
      const response = await FinetuneModel.checkAvailableDevice();

      setAvailableDevices(response.data);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to check device status');
    } finally {
      setIsDeviceLoading(false);
    }
  }

  // device 체크 할 필요 없기 때문에 지울것.
  // useEffect(() => {
  //   setDeviceStatus();
  // }, []);

  const onCurrentpageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!datasetId) return;
    dispatch(setTool(Tool.Select));
    getDataset(Number(datasetId));
  }, []);

  // train 중인지 확인
  useEffect(() => {
    getIsOnTrain(userId, datasetId).then((flag) => {
      setIsOnTrain(flag);
    });
    // test용 true
    // setIsOnTrain(true);
  }, []);

  const isImageListEmpty = useMemo(() => {
    if (!dataset) {
      return true;
    }

    if (
      currentPage === 1 &&
      dataset.imageIds.length === 0 &&
      dataset.imageIds.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }, [dataset, currentPage]);

  // TODO: descripttion에서 category 편집 가능하게

  return (
    <Container id="dataset">
      <Controls
        setDeviceStatus={setDeviceStatus}
        availableDevices={availableDevices}
        isOnTrain={isOnTrain}
        setIsOnTrain={setIsOnTrain}
        isDeviceLoading={isDeviceLoading}
      />
      {dataset && (
        <Fragment>
          <Information
            {...dataset}
            handleCategoryDeleted={handleCategoryDeleted}
            handleCategoryAdded={handleCategoryAdded}
            isOnTrain={isOnTrain}
          />
          <Content>
            {!isImageListEmpty && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={dataset.imageIds.length}
              />
            )}
            <ImageList
              imageIds={dataset.imageIds[currentPage - 1]}
              deleteImage={deleteImage}
              isOnTrain={isOnTrain}
            />
            {!isImageListEmpty && (
              <PaginationPanel
                onCurrentPageChange={onCurrentpageChange}
                currentPage={currentPage}
                lastPage={dataset.imageIds.length}
              />
            )}
          </Content>
        </Fragment>
      )}
    </Container>
  );
}
