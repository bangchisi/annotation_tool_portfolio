import axios from 'axios';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

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

    console.log('ImagesModel.uploadImages, images: ');
    console.dir(images);
    return axios.post(url, {
      images: images.getAll('images'),
    });
  },
};

export default ImagesModel;
