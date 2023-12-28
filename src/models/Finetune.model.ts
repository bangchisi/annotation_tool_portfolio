import axios from 'axios';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const FinetuneModel = {
  start: (
    datasetId: number,
    deviceId: number,
    modelType: string,
    finetuneName: string,
  ) => {
    const url = `${SERVER_URL}/finetune`;

    return axios.post(url, {
      dataset_id: datasetId,
      device_id: deviceId,
      vit_model_type: modelType,
      finetune_name: finetuneName,
      // 개발용 속성. epoch를 임의로 1로 해서 빠르게 끝내기 위함
      // num_epochs: process.env.NODE_ENV === 'development' ? 1 : null,
    });
  },
  queue: (
    datasetId: number, // int
    vitModelType: string, // 현재 "vit_b" 만 사용한다. 나중을 위해 넣어둠
    finetuneName: string, // 사용자가 정의하는 값, 생성할 모델 이름
  ) => {
    const url = `${SERVER_URL}/finetune/queue`;

    return axios.post(url, {
      dataset_id: datasetId,
      vit_model_type: 'vit_b',
      finetune_name: finetuneName,
    });
  },
  deleteLogs: (finetuneIds: number[]) => {
    const url = `${SERVER_URL}/finetune/${finetuneIds}`;

    return axios.delete(url);
  },
  loadFinetunedModel: (finetuneId: number) => {
    const url = `${SERVER_URL}/sam/load/finetuned/${finetuneId}`;

    return axios.get(url);
  },
};

export default FinetuneModel;
