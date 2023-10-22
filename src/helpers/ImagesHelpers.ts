import ImagesModel from 'models/Images.model';
import { axiosErrorHandler } from './Axioshelpers';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const getThumbnail = async (datasetId: number, length: number) => {
  try {
    const response = await ImagesModel.getThumbnail(datasetId, length);
    console.dir(response);
    // TODO: response가 아닌 실제 path를 전달해야함. response.data.path 라든지
  } catch (error) {
    axiosErrorHandler(error, 'Failed to get thumbnail');
    const response =
      process.env.NODE_ENV === 'development'
        ? `/no_image.png`
        : `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/no_images.png`;

    return response;
  }
};

export const getImagePath = (imageId: number, length = 100): string => {
  const url =
    process.env.NODE_ENV === 'development'
      ? `${DEV_URL}/image/${imageId}?length=${length}`
      : `${SERVER_URL}/image/${imageId}?length=${length}`;

  return url;
};
