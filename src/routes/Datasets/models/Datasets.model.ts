import axios from 'axios';

const baseURL = '/api/datasets/';

const DatasetsModel = {
  getDatasets: () => {
    return axios.get(`${baseURL}/datasets`);
  },
};

export default DatasetsModel;
