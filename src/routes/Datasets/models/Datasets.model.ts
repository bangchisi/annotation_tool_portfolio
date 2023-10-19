import axios from 'axios';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

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
    });
  },
};

export default DatasetsModel;
