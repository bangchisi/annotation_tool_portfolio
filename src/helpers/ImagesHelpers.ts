import ImagesModel from 'models/Images.model';
import { axiosErrorHandler } from './Axioshelpers';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const getThumbnailPath = async (datasetId: number, length = 100) => {
  try {
    await ImagesModel.getThumbnail(datasetId, length);

    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/image/thumbnail/${datasetId}?length=${length}`
        : `${SERVER_URL}/image/thumbnail/${datasetId}?length=${length}`;

    return url;
  } catch (error) {
    axiosErrorHandler(error, 'Failed to get thumbnail');
    return '/no_image.png';
  }
};

export const getImagePath = (imageId: number, length = 100): string => {
  const url =
    process.env.NODE_ENV === 'development'
      ? `${DEV_URL}/image/${imageId}?length=${length}`
      : `${SERVER_URL}/image/${imageId}?length=${length}`;

  return url;
};

export function getCanvasImage(imageId: number): string {
  const url =
    process.env.NODE_ENV === 'development'
      ? `${DEV_URL}/image/${imageId}`
      : `${SERVER_URL}/image/${imageId}`;

  return url;
}
