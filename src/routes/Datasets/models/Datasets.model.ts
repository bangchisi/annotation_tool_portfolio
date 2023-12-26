import axios from 'axios';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const DatasetsModel = {
  getDatasetsByUserId: (userId: string) => {
    const url = `${SERVER_URL}/dataset/${userId}/datasets`;

    return axios.get(url);
  },
  createDataset: (
    userId: string,
    datasetName: string,
    categories: string[][],
    description: string,
    superdatasetName: string,
  ) => {
    const url = `${SERVER_URL}/dataset`;
    return axios.post(url, {
      user_id: userId,
      dataset_name: datasetName,
      categories,
      description,
      superdataset_name: superdatasetName,
    });
  },
  deleteDataset: (datasetId: number) => {
    const url = `${SERVER_URL}/dataset/${datasetId}`;

    return axios.delete(url);
  },
};

export default DatasetsModel;
