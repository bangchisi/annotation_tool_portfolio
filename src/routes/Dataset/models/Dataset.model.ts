import axios from 'axios';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const DatasetModel = {
  getDatasetById: (datasetId: number | undefined) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/${datasetId}`
        : `${SERVER_URL}/dataset/${datasetId}`;

    return axios.get(url);
  },
  exportDataset: (datasetId: number, exportFormat: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/export/${datasetId}`
        : `${SERVER_URL}/dataset/export/${datasetId}`;

    return axios.post(url, {
      export_format: exportFormat,
    });
  },
  download: (link: string) => {
    const url = link;

    return axios.get(url);
  },
  getAnnotatedImagesCount: (datasetId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/annotated/${datasetId}`
        : `${SERVER_URL}/dataset/annotated/${datasetId}`;

    return axios.get(url);
  },
  deleteCategory: (categoryId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/category/${categoryId}`
        : `${SERVER_URL}/dataset/category/${categoryId}`;

    return axios.delete(url);
  },
};

export default DatasetModel;
