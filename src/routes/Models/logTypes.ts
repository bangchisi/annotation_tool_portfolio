export type LogType = {
  finetuneId: number;
  datasetId: number;
  finetuneName: string;
  vitModelType: string;
  modelDir: string;
  finetuneStartTime: Date;
  finetuneEndTime?: Date; // 학습 진행 중일 시 공백일 수 있음
  isDone: boolean;
  numTrainImages: number;
  numTestImages: number;
  trainImageIds: number[];
  testImageIds: number[];
  status: string;
  detail: {
    // 학습 진행 전, 후일 시 공백
    percentage?: number;
    iteration?: number;
    total?: number;
    remainingTime?: number;
  };
  result: {
    datasetName: string;
    deviceId: number;
    expName: string;
    train: {
      // 학습 진행 중일 시 공백일 수 있음
      bestEpoch?: number;
      bestTestLoss?: number;
    };
    evaluation: {
      // 학습 진행 중일 시 공백일 수 있음
      meanDiceCoefficient?: number;
      stdDiceCoefficient?: number;
      meanHausdorffDistance?: number;
      stdHausdorffDistance?: number;
      meanAssd?: number;
      stdAssd?: number;
    };
  };
};

// Function to extract FirstVisibleRow
export function extractFirstVisibleRow(log: LogType) {
  return {
    finetuneId: log?.finetuneId,
    finetuneName: log?.finetuneName,
    datasetName: log?.result?.datasetName,
    status: log?.status,
    // isDone: log?.isDone,
    finetuneStartTime: log?.finetuneStartTime,
    remainingTime: log?.detail?.remainingTime,
  };
}

// Function to extract SecondVisibleRow
export function extractSecondVisibleRow(log: LogType) {
  return {
    numTrainImages: log?.numTrainImages,
    numTestImages: log?.numTestImages,
    numTotalImages: log?.numTrainImages + log?.numTestImages,
    // trainProgress: '',
    // evaluationProgress: '',
    // deviceId: log?.result?.deviceId,
  };
}

// Function to extract FirstCollapsibleRow
export function extractFirstCollapsibleRow(log: LogType) {
  return {
    // datasetId: log?.datasetId,
    // vitModelType: log?.vitModelType,
    // modelDir: log?.modelDir,
    finetuneStartTime: log?.finetuneStartTime,
    finetuneEndTime: log?.finetuneEndTime,
    bestEpoch: log?.result?.train?.bestEpoch,
    bestTestLoss: log?.result?.train?.bestTestLoss,
  };
}

// Function to extract SecondCollapsibleRow
export function extractSecondCollapsibleRow(log: LogType) {
  return {
    detailPercentage: log?.detail?.percentage,
    detailIteration: log?.detail?.iteration,
    detailTotal: log?.detail?.total,
    detailRemainingTime: log?.detail?.remainingTime,
  };
}

// Function to extract ThirddCollapsibleRow
export function extractThirdCollapsibleRow(log: LogType) {
  return {
    meanDiceCoefficient: log?.result?.evaluation?.meanDiceCoefficient,
    stdDiceCoefficient: log?.result?.evaluation?.stdDiceCoefficient,
    meanHausdorffDistance: log?.result?.evaluation?.meanHausdorffDistance,
    stdHausdorffDistance: log?.result?.evaluation?.stdHausdorffDistance,
    meanAssd: log?.result?.evaluation?.meanAssd,
    stdAssd: log?.result?.evaluation?.stdAssd,
  };
}

// Function to extract FourthCollapsibleRow
export function extractFourthCollapsibleRow(log: LogType) {
  return {
    // datasetName: log?.result?.datasetName,
    // deviceId: log?.result?.deviceId,
    // expName: log?.result?.expName,
    bestEpoch: log?.result?.train?.bestEpoch,
    bestTestLoss: log?.result?.train?.bestTestLoss,
  };
}

export const groupLogToTableData = (log: LogType) =>
  [
    extractFirstVisibleRow(log),
    extractSecondVisibleRow(log),
    extractFirstCollapsibleRow(log),
    // extractSecondCollapsibleRow(log),
    extractThirdCollapsibleRow(log),
    // extractFourthCollapsibleRow(log),
  ] as const;

// Types based on the return values of the functions
export type FirstVisibleRowType = ReturnType<typeof extractFirstVisibleRow>;
export type SecondVisibleRowType = ReturnType<typeof extractSecondVisibleRow>;
export type FirstCollapsibleRowType = ReturnType<
  typeof extractFirstCollapsibleRow
>;
export type SecondCollapsibleRowType = ReturnType<
  typeof extractSecondCollapsibleRow
>;
export type ThirdCollapsibleRowType = ReturnType<
  typeof extractThirdCollapsibleRow
>;
export type FourthCollapsibleRowType = ReturnType<
  typeof extractFourthCollapsibleRow
>;

export type VisibleRowType = FirstVisibleRowType | SecondVisibleRowType;
export type CollapsibleRowType =
  | FirstCollapsibleRowType
  | SecondCollapsibleRowType
  | ThirdCollapsibleRowType
  | FourthCollapsibleRowType;
