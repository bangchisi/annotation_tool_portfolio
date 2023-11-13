import { Button } from '@mui/material';
import { Container } from './Controls.style';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { Fragment, useRef, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImagesModel from 'models/Images.model';
import { useParams } from 'react-router-dom';
import DatasetModel from '../models/Dataset.model';

interface ControlsProps {
  setDeviceStatus: () => Promise<void>;
  availableDevices?: { [key: number]: boolean };
}

export default function Controls(props: ControlsProps) {
  const { setDeviceStatus, availableDevices } = props;
  const datasetId = Number(useParams().datasetId);
  const [isLoading, setIsLoading] = useState(false);
  const filesInput = useRef<HTMLInputElement>(null);
  const formData = new FormData();

  const uploadImages = async (
    datasetId: number | undefined,
    images: FormData,
  ) => {
    if (!datasetId) return;
    if (!images) return;

    try {
      setIsLoading(true);
      const response = await ImagesModel.uploadImages(datasetId, images);
      console.log('Dataset.tsx Controls.tsx, upload image response: ');
      console.dir(response);
    } catch (error) {
      axiosErrorHandler('error', 'Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const filesToFormData = (files: FileList): void => {
    if (files.length <= 0) return;

    for (let idx = 0; idx < files.length; idx++) {
      formData.append('images', files[idx]);
    }
  };

  const onFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    filesToFormData(files);
  };

  const onTrainStart = async (
    datasetId: number,
    deviceId: number,
    modelType: string,
  ) => {
    if (!isEnoughSamples(datasetId)) return;

    try {
      // TODO: change dummyStart -> FinetuneModel.start
      const response = await dummyStart(datasetId, deviceId, modelType);
      console.log(response);
      console.log('start fine tuning');
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

    console.log('annotated: ', num_annotated_images);

    const result = num_annotated_images >= criteria;
    if (!result)
      alert(`${criteria}개 이상 이미지가 annotated 상태여야 합니다.`);
    return result;
  }

  // dummy start not to finetune for dev
  function dummyStart(datasetId: number, deviceId: number, modelType: string) {
    console.log(datasetId, deviceId, modelType);
    setTimeout(() => {
      return true;
    });
  }

  return (
    <Container>
      {availableDevices && (
        <Fragment>
          {Object.entries(availableDevices).map(([id, device]) => {
            const deviceId = Number(id);
            return (
              <Button
                key={deviceId}
                disabled={!device}
                onClick={() => onTrainStart(datasetId, deviceId, 'vit_h')}
              >
                {device ? `TRAIN (device ${deviceId})` : 'BUSY'}
              </Button>
            );
          })}
        </Fragment>
      )}
      <form>
        <input
          ref={filesInput}
          name="images"
          type="file"
          multiple
          onChange={onFilesChange}
        />
        <Button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            console.log('upload images');
            if (!datasetId) return;
            uploadImages(Number(datasetId), formData);
          }}
        >
          UPLOAD IMAGE
        </Button>
      </form>
      {isLoading && (
        <LoadingSpinner message="이미지 업로드 중입니다. 잠시만 기다려주세요." />
      )}
    </Container>
  );
}
