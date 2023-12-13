import { Button, TextField, Typography } from '@mui/material';
import ModalWrapper from 'components/ModalWrapper/ModalWrapper';
import { useState } from 'react';
import { ModalFooter } from './ModelDeleteModal.style';

interface ModelDeleteModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteModelName: string;
  onDelete: (finetuneIds: number[]) => Promise<void>;
  getLogs: () => Promise<void>;
  finetuneId: number[];
}

export default function ModelDeleteModal(props: ModelDeleteModalProps) {
  const { open, setOpen, deleteModelName, onDelete, getLogs, finetuneId } =
    props;
  const [deleteModelNameConfirm, setDeleteModelNameConfirm] = useState('');
  const [modelNameColor, setModelNameColor] = useState('orange');

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setDeleteModelNameConfirm('');
    setModelNameColor('orange');
  };

  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Delete Model">
      <Typography variant="body1">
        지울 모델 이름을 정확히 입력해주세요.
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginBottom: '10px',
          color: '#FA4549',
        }}
      >
        {deleteModelName}{' '}
      </Typography>
      {modelNameColor === 'red' && (
        <Typography color="blue">다시 정확히 입력해주세요</Typography>
      )}
      <TextField
        type="text"
        size="small"
        value={deleteModelNameConfirm}
        onChange={(event) => {
          setDeleteModelNameConfirm(event.target.value);
          setModelNameColor('orange');
        }}
      />
      <ModalFooter>
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: '4px',
            marginRight: '7px',
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            color: '#FA4549',
            borderRadius: '4px',
          }}
          color="warning"
          onClick={() => {
            if (deleteModelName !== deleteModelNameConfirm) {
              setModelNameColor('red');
              return;
            }
            alert('삭제성공');
            handleClose();
            onDelete(finetuneId).then(() => {
              getLogs();
            });
          }}
        >
          DELETE
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
}
