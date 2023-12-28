import { Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useModal } from 'components/ModalWrapper/ModalWrapper';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FlexTable from 'routes/Models/Components/FlexTable';
import { LogType } from 'routes/Models/logTypes';
import ModelDeleteModal from './Components/ModelDeleteModal/ModelDeleteModal';
import { Container, QueueBox, TableWrapper } from './Models.style';
import { useTypedSWR } from 'hooks';

export default function Models() {
  const userId = useAppSelector((state) => state.auth.user.userId);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteModelName, setDeleteModelName] = useState('');
  const [finetuneId, setFinetuneId] = useState<number[]>([]);
  const { open, setOpen } = useModal();

  const { data, error, isLoading, mutate } = useTypedSWR<LogType[]>(
    'get',
    `/finetune/${userId}`,
  );

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

  const runningModels = useMemo(
    () =>
      data?.filter(
        (log) => !log.status.toLocaleLowerCase().includes('waiting'),
      ),
    [data],
  );

  const queuedModels = useMemo(
    () =>
      data?.filter((log) => log.status.toLocaleLowerCase().includes('waiting')),
    [data],
  );

  const renderFlexTable = useCallback(
    (log: LogType, index: number) => (
      <FlexTable key={index} log={log} handleDelete={handleDelete} />
    ),
    [handleDelete],
  );

  const RunningModels = useMemo(
    () => runningModels && runningModels.map(renderFlexTable),
    [runningModels, renderFlexTable],
  );

  const QueuedModels = useMemo(
    () => queuedModels && queuedModels.map(renderFlexTable),
    [queuedModels, renderFlexTable],
  );

  if (error) {
    console.log('Models.tsx error');
    console.dir(error);
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="모델 로그를 불러오는 중입니다. 잠시만 기다려주세요." />
    );
  }

  return (
    <>
      <Helmet>
        <body className="models-page" />
      </Helmet>
      <Container className="model-step">
        {/* 테이블 렌더링 */}
        <TableWrapper>
          {RunningModels}
          {QueuedModels && QueuedModels.length > 0 && !isLoading ? (
            <QueueBox>
              <Typography variant="h3">Queue:</Typography>
              {QueuedModels}
            </QueueBox>
          ) : null}
        </TableWrapper>
        <ModelDeleteModal
          open={open}
          setOpen={setOpen}
          deleteModelName={deleteModelName}
          reload={mutate}
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
