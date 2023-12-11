import { LogType } from 'routes/Models/Models';

type FirstVisibleRow = {
  finetuneId: LogType['finetuneId'];
  finetuneName: LogType['finetuneName'];
  datasetName: LogType['result']['datasetName'];
  status: LogType['status'];
  isDone: LogType['isDone'];
  finetuneStartTime: LogType['finetuneStartTime'];
  remainingTime: LogType['detail']['remainingTime'];
};

type SecondVisibleRow = {
  // numTrainImages, numTestImages:
  // 둘을 표시하고 둘을 합친 total을 따로 표시
  numTrainImages: LogType['numTrainImages'];
  numTestImages: LogType['numTestImages'];
  numTotalImages: number;
  trainProgress: number;
  evaluationProgress: number;
  deviceId: LogType['result']['deviceId'];
};

type FirstCollapsibleRow = {
  datasetId: LogType['datasetId'];
  vitModelType: LogType['vitModelType'];
  modelDir: LogType['modelDir'];
  finetuneStartTime: LogType['finetuneStartTime'];
  finetuneEndTime: LogType['finetuneEndTime'];
};

type SecondCollapsibleRow = {
  detailPercentage: LogType['detail']['percentage'];
  detailIteration: LogType['detail']['iteration'];
  detailTotal: LogType['detail']['total'];
  detailRemainingTime: LogType['detail']['remainingTime'];
};

type ThirddCollapsibleRow = {
  meanDiceCoefficient: LogType['result']['evaluation']['meanDiceCoefficient'];
  stdDiceCoefficient: LogType['result']['evaluation']['stdDiceCoefficient'];
  meanHausdorffDistance: LogType['result']['evaluation']['meanHausdorffDistance'];
  stdHausdorffDistance: LogType['result']['evaluation']['stdHausdorffDistance'];
  meanAssd: LogType['result']['evaluation']['meanAssd'];
  stdAssd: LogType['result']['evaluation']['stdAssd'];
};

type FourthCollapsibleRow = {
  datasetName: LogType['result']['datasetName'];
  deviceId: LogType['result']['deviceId'];
  expName: LogType['result']['expName'];
  bestEpoch: LogType['result']['train']['bestEpoch'];
  bestTestLoss: LogType['result']['train']['bestTestLoss'];
};

const Row = () => {
  return <div></div>;
};

export default Row;
