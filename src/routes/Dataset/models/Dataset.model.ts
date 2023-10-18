import axios from 'axios';

const baseURL = '/api/dataset/';

const DatasetModel = {
  getDataset: (datasetId: number) => {
    return axios.get(`${baseURL}/dataset/${datasetId}`);
  },
};

export default DatasetModel;
