import {
  Container,
  DeleteButton,
  Property,
  PropertyName,
  PropertyValue,
} from './ModelCard.style';

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

export default function ModelCard(props: ModelCardProps) {
  const { setOpen, setDeleteModelName, setFinetuneId, onDelete, getLogs, log } =
    props;

  return (
    <Container>
      <Property>
        <PropertyName>ID</PropertyName>
        <PropertyValue>{log.finetuneId}</PropertyValue>
      </Property>
      <Property>
        <PropertyName>이름</PropertyName>
        <PropertyValue>{log.finetuneName}</PropertyValue>
      </Property>
      <Property>
        <PropertyName>Dataset</PropertyName>
        <PropertyValue>{log.result.datasetName}</PropertyValue>
      </Property>
      <Property>
        <PropertyName>학습시작</PropertyName>
        <PropertyValue>{log.finetuneStartTime.toLocaleString()}</PropertyValue>
      </Property>
      <Property>
        <PropertyName>상태</PropertyName>
        <PropertyValue>{log.status}</PropertyValue>
      </Property>
      <Property>
        <PropertyName>남은시간</PropertyName>
        <PropertyValue>
          {log.detail.remainingTime ? log.detail.remainingTime : '0'}
        </PropertyValue>
      </Property>
      <Property>
        <PropertyName>완료여부</PropertyName>
        <PropertyValue>{log.isDone ? '완료' : '진행중'}</PropertyValue>
      </Property>
      <DeleteButton
        variant="contained"
        color="warning"
        disabled={log.status === 'Getting Ready to Train'}
        onClick={() => {
          setFinetuneId([log.finetuneId]);
          setOpen(true);
          setDeleteModelName(log.finetuneName);
        }}
      >
        DELETE
      </DeleteButton>
    </Container>
  );
}
