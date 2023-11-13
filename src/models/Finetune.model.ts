import axios from 'axios';

const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const FinetuneModel = {
  checkAvailableDevice: () => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/finetune/is_available`
        : `${SERVER_URL}/finetune/is_available`;

    return axios.get(url);
  },
  start: (datasetId: number, deviceId: number, modelType: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/finetune`
        : `${SERVER_URL}/finetune`;

    return axios.post(url, {
      dataset_id: datasetId,
      device_id: deviceId,
      vit_model_type: modelType,
    });
  },
};

export default FinetuneModel;
