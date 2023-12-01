import { Container, FilesLabel } from './Controls.style';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useRef, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImagesModel from 'models/Images.model';
import { useParams } from 'react-router-dom';
import DatasetModel from '../models/Dataset.model';
import FinetuneModel from 'models/Finetune.model';
import TrainStartModal from './TrainStartModal/TrainStartModal';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

interface ControlsProps {
  setDeviceStatus: () => Promise<void>;
  availableDevices?: { [key: number]: boolean };
  isOnTrain: boolean;
}

export default function Controls(props: ControlsProps) {
  const { setDeviceStatus, availableDevices, isOnTrain } = props;
  const datasetId = Number(useParams().datasetId);
  const [isLoading, setIsLoading] = useState(false);
  const filesInput = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  const [finetuneName, setFinetuneName] = useState('');
  const [baseModelName, setBaseModelName] = useState('');

  const uploadImages = async (
    datasetId: number | undefined,
    images: FormData,
  ) => {
    if (!datasetId) return;
    if (!images) return;

    try {
      setIsLoading(true);
      await ImagesModel.uploadImages(datasetId, images);
    } catch (error) {
      axiosErrorHandler('error', 'Failed to upload images');
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const onFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isFolder?: boolean,
  ) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length <= 0) return;

    for (let idx = 0; idx < files.length; idx++) {
      if (isFolder && !files[idx].name.match(/mip\.(jpg|png|tiff)$/i)) continue;
      formData.append('images', files[idx]);
    }

    if (!formData.getAll('images').length) {
      alert('해당 폴더에 MIP 파일이 없습니다.');
      return;
    }

    uploadImages(Number(datasetId), formData);
  };

  const onTrainStart = async (
    datasetId: number,
    deviceId: number,
    modelType: string,
    finetuneName: string,
  ) => {
    if (!isEnoughSamples(datasetId)) return;

    try {
      await FinetuneModel.start(datasetId, deviceId, modelType, finetuneName);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to start train');
    } finally {
      setDeviceStatus();
    }
  };

  // validation (annotated image count)
  async function isEnoughSamples(datasetId: number) {
    const criteria = 2;
    const response = await DatasetModel.getAnnotatedImagesCount(datasetId);
    if (!response) return false;

    const { num_annotated_images } = response.data; // { num_total_images, num_annotated_images }

    const result = num_annotated_images >= criteria;
    if (!result)
      alert(
        `최소 2개 이미지가 annotated 상태여야 합니다.
        현재 annotated 이미지 (${num_annotated_images}개)`,
      );
    return result;
  }

  return (
    <Container>
      {isOnTrain && <ComponentBlocker message="" />}
      <TrainStartModal
        availableDevices={availableDevices}
        onTrainStart={onTrainStart}
        baseModelName={baseModelName}
        setBaseModelName={setBaseModelName}
        finetuneName={finetuneName}
        setFinetuneName={setFinetuneName}
        datasetId={datasetId}
      />
      <form>
        <label htmlFor=""></label>
        <input
          style={{ display: 'none' }}
          id="folderInput"
          ref={filesInput}
          name="images"
          type="file"
          accept="image/*"
          onChange={(event) => onFilesChange(event, true)}
          webkitdirectory=""
        />
        <FilesLabel htmlFor="folderInput" sx={{ marginRight: '20px' }}>
          <div>
            <DriveFolderUploadOutlinedIcon fontSize="medium" />
            <span>폴더 업로드</span>
          </div>
        </FilesLabel>
      </form>
      <form>
        <label htmlFor=""></label>
        <input
          style={{ display: 'none' }}
          id="filesInput"
          ref={filesInput}
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesChange}
        />
        <FilesLabel htmlFor="filesInput">
          <div>
            <CloudUploadRoundedIcon fontSize="medium" />
            <span>사진 업로드</span>
          </div>
        </FilesLabel>
      </form>
      {isLoading && (
        <LoadingSpinner message="이미지 업로드 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
