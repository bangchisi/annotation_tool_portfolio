import ImagesModel from 'models/Images.model';
import { axiosErrorHandler } from './Axioshelpers';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const getThumbnailPath = async (datasetId: number, length = 100) => {
  try {
    await ImagesModel.getThumbnail(datasetId, length);

    const url = `${SERVER_URL}/image/thumbnail/${datasetId}?length=${length}`;

    return url;
  } catch (error) {
    axiosErrorHandler(error, 'Failed to get thumbnail');
    return '/no_image.png';
  }
};

export const getImagePath = (imageId: number, length = 100): string => {
  const url = `${SERVER_URL}/image/${imageId}?length=${length}`;

  return url;
};

export function getCanvasImage(imageId: number): string {
  const baseUrl = SERVER_URL;

  return new URL(`/image/${imageId}`, baseUrl).href;
}
