import axios from 'axios';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const ImagesModel = {
  getThumbnail: (datasetId: number, length: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/image/thumbnail/${datasetId}?length=${length}`
        : `${SERVER_URL}/image/thumbnail/${datasetId}?length=${length}`;

    return axios.get(url);
  },
  uploadImages: (datasetId: number, images: FormData) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/image?dataset_id=${datasetId}`
        : `${SERVER_URL}/image?dataset_id=${datasetId}`;

    return axios.post(
      url,
      images,
      // multipart headers
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  },
  deleteImage: (imageId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/image/${imageId}`
        : `${SERVER_URL}/image/${imageId}`;

    return axios.delete(url);
  },
};

export default ImagesModel;
