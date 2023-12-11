import { useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useModal } from 'components/ModalWrapper/ModalWrapper';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { useEffect, useState } from 'react';
import { LogType, extractLogAsTableData } from 'routes/Models/logTypes';
import ModelDeleteModal from './ModelDeleteModal/ModelDeleteModal';
import { Container } from './Models.style';

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
  }, [userId]);

  useEffect(() => {
    if (logs && logs.length > 0) {
      // use functions inside ./logTypes.ts to extract each groups
      const log = logs[0];
      const extracted = extractLogAsTableData(log);
      console.dir(log);
      console.dir(extracted);
    }
  }, [logs]);

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
