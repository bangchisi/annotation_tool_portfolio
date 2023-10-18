import axios from 'axios';

const baseURL = '/api/models/';

const ModelsModel = {
  getModels: () => {
    return axios.get(`${baseURL}/models`);
  },
};

export default ModelsModel;
