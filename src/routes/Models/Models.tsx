import { useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useModal } from 'components/ModalWrapper/ModalWrapper';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { useEffect, useState } from 'react';
import ModelDeleteModal from './ModelDeleteModal/ModelDeleteModal';
import { Container } from './Models.style';

export interface LogType {
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
}

export default function Models() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [logs, setLogs] = useState<LogType[]>();
  const [deleteModelName, setDeleteModelName] = useState('');
  const [finetuneId, setFinetuneId] = useState<number[]>([]);
  const { open, setOpen } = useModal();

  async function getLogs(userId: string) {
    setIsLogsLoading(true);
    try {
      const response = await FinetuneModel.getLogs(userId);
      setLogs(response.data);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get finetune logs');
    } finally {
      setIsLogsLoading(false);
    }
  }

  async function onDelete(finetuneIds: number[]) {
    setIsDeleteLoading(true);
    try {
      await FinetuneModel.deleteLogs(finetuneIds);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete finetune model');
    } finally {
      setIsDeleteLoading(false);
    }
  }

  useEffect(() => {
    getLogs(userId);
  }, []);

  console.table(logs);

  return (
    <Container>
      <ModelDeleteModal
        open={open}
        setOpen={setOpen}
        deleteModelName={deleteModelName}
        getLogs={() => getLogs(userId)}
        onDelete={onDelete}
        finetuneId={finetuneId}
      />
      {isLogsLoading && (
        <LoadingSpinner message="모델 리스트를 불러오는 중입니다..." />
      )}
      {isDeleteLoading && (
        <LoadingSpinner message="모델을 삭제하는 중입니다..." />
      )}
    </Container>
  );
}
