import ImagesModel from 'models/Images.model';
import { axiosErrorHandler } from './Axioshelpers';

const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

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
  const baseUrl = process.env.NODE_ENV === 'development' ? DEV_URL : SERVER_URL;

  return new URL(`/image/${imageId}`, baseUrl).href;
}
