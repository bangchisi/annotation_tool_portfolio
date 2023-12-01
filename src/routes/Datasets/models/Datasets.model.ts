import axios from 'axios';

const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const DatasetsModel = {
  getDatasetsByUserId: (userId: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/${userId}/datasets`
        : `${SERVER_URL}/dataset/${userId}/datasets`;

    return axios.get(url);
  },
  createDataset: (
    userId: string,
    datasetName: string,
    categories: string[][],
    description: string,
    superdatasetName: string,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset`
        : `${SERVER_URL}/dataset`;
    return axios.post(url, {
      user_id: userId,
      dataset_name: datasetName,
      categories,
      description,
      superdataset_name: superdatasetName,
    });
  },
  deleteDataset: (datasetId: number) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/dataset/${datasetId}`
        : `${SERVER_URL}/dataset/${datasetId}`;

    return axios.delete(url);
  },
};

export default DatasetsModel;
