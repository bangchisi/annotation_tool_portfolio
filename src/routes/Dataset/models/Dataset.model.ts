import axios from 'axios';

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
  addCategory: (
    datasetId: number,
    categoryName: string,
    categoryColor: string,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/category/${datasetId}`
        : `${SERVER_URL}/dataset/category/${datasetId}`;

    return axios.post(url, {
      name: categoryName,
      color: categoryColor,
    });
  },
  deleteCategory: (categoryId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/category/${categoryId}`
        : `${SERVER_URL}/dataset/category/${categoryId}`;

    return axios.delete(url);
  },
  updateDatset: (
    datasetId: number, // int
    datasetName: string,
    superdatasetName: string,
    description: string,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset`
        : `${SERVER_URL}/dataset`;

    return axios.put(url, {
      dataset_id: datasetId,
      dataset_name: datasetName,
      superdataset_name: superdatasetName,
      description: description,
    });
  },
};

export default DatasetModel;
