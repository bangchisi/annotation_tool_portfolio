import { Button } from '@mui/material';
import { Container } from './Controls.style';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { useRef, useState } from 'react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ImagesModel from 'models/Images.model';
import { useParams } from 'react-router-dom';

export default function Controls() {
  const datasetId = useParams().datasetId;
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
      const response = await ImagesModel.uploadImages(datasetId, images);
      console.log('Dataset.tsx Controls.tsx, upload image response: ');
      console.dir(response);
      setIsLoading(true);
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

  return (
    <Container>
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
      {isLoading && <LoadingSpinner />}
    </Container>
  );
}
