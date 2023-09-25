import axios from 'axios';

const baseURL = '/api/annotator/';

const AnnotatorModel = {
  getCategories: (datasetId: number, imageId: number) => {
    return axios.get(`${baseURL}/${datasetId}/${imageId}`);
  },
};

export default AnnotatorModel;
