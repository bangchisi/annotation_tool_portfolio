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
  start: (
    datasetId: number,
    deviceId: number,
    modelType: string,
    finetuneName: string,
  ) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/finetune`
        : `${SERVER_URL}/finetune`;

    return axios.post(url, {
      dataset_id: datasetId,
      device_id: deviceId,
      vit_model_type: modelType,
      finetune_name: finetuneName,
      // 개발용 속성. epoch를 임의로 1로 해서 빠르게 끝내기 위함
      num_epochs: 1,
    });
  },
  getLogs: (userId: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/finetune/${userId}`
        : `${SERVER_URL}/finetune/${userId}`;

    return axios.get(url);
  },
  deleteLogs: (finetuneIds: number[]) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/finetune`
        : `${SERVER_URL}/finetune`;

    return axios.delete(url, {
      data: {
        finetune_ids: finetuneIds,
      },
    });
  },
};

export default FinetuneModel;
