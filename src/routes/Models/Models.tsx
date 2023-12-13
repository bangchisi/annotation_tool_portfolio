import { useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useModal } from 'components/ModalWrapper/ModalWrapper';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FlexTable from 'routes/Models/Components/FlexTable';
import { LogType } from 'routes/Models/logTypes';
import ModelDeleteModal from './Components/ModelDeleteModal/ModelDeleteModal';
import { Container, TableWrapper } from './Models.style';

export default function Models() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [logs, setLogs] = useState<LogType[]>();
  const [deleteModelName, setDeleteModelName] = useState('');
  const [finetuneId, setFinetuneId] = useState<number[]>([]);
  const { open, setOpen } = useModal();

  const onDelete = useCallback(async (finetuneIds: number[]) => {
    setIsDeleteLoading(true);
    try {
      await FinetuneModel.deleteLogs(finetuneIds);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to delete finetune model');
    } finally {
      setIsDeleteLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    (finetuneId: number, finetuneName: string) => {
      setDeleteModelName(finetuneName);
      setFinetuneId([finetuneId]);
      setOpen(true);
    },
    [setDeleteModelName, setFinetuneId, setOpen],
  );

  const getLogs = useCallback(async (userId: string) => {
    setIsLogsLoading(true);
    try {
      const response = await FinetuneModel.getLogs(userId);
      setLogs(response.data);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to get finetune logs');
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLogs(userId);
  }, [getLogs, userId]);

  return (
    <>
      <Helmet>
        <body className="models-page" />
      </Helmet>
      {isLogsLoading && (
        <LoadingSpinner message="모델 로그를 불러오는 중입니다. 잠시만 기다려주세요." />
      )}
      <Container>
        <TableWrapper>
          {logs &&
            logs.map((log, index) => (
              <FlexTable
                key={index}
                index={index}
                log={log}
                handleDelete={handleDelete}
              />
            ))}
        </TableWrapper>
        <ModelDeleteModal
          open={open}
          setOpen={setOpen}
          deleteModelName={deleteModelName}
          getLogs={() => getLogs(userId)}
          onDelete={onDelete}
          finetuneId={finetuneId}
        />
        {isDeleteLoading && (
          <LoadingSpinner message="모델을 삭제하는 중입니다..." />
        )}
      </Container>
    </>
  );
}
