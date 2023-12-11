import React from 'react';
import { Container, DeleteButton } from './ModelCard.style';

interface ModelCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModelName: React.Dispatch<React.SetStateAction<string>>;
  setFinetuneId: React.Dispatch<React.SetStateAction<number[]>>;
  onDelete: (finetuneIds: number[]) => Promise<void>;
  getLogs: () => Promise<void>;
  log: {
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
}

function remainingTimeToString(remainingTime: number) {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = Math.floor((remainingTime % 3600) % 60);

  if (hours === -1 || minutes === -1 || seconds === -1) {
    return '남은 시간 계산중..';
  }

  if (hours === 0) {
    if (minutes === 0) {
      return `${seconds}초`;
    }
    return `${minutes}분 ${seconds}초`;
  }

  return `${hours}시간 ${minutes}분 ${seconds}초`;
}

const NewModelCard = (props: ModelCardProps) => {
  const { setOpen, setDeleteModelName, setFinetuneId, log } = props;
  const {
    finetuneId,
    finetuneName,
    result: { datasetName },
    finetuneStartTime,
    detail: { remainingTime },
    isDone,
    status,
  } = log;

  return (
    <Container>
      <DeleteButton
        variant="contained"
        color="warning"
        disabled={status === 'Getting Ready to Train'}
        disableFocusRipple
        onClick={() => {
          setFinetuneId([finetuneId]);
          setDeleteModelName(finetuneName);
          setOpen(true);
        }}
      >
        DELETE
      </DeleteButton>
    </Container>
  );
};

export default NewModelCard;
