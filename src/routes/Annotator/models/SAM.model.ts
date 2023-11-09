import axios from 'axios';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const SAMModel = {
  loadModel: (modelType?: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/sam/load/${modelType}`
        : `${SERVER_URL}/sam/load/${modelType}`;

    return axios.get(url);
  },
};

export default SAMModel;
