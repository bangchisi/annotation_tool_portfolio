import { useState } from 'react';
import {
  ModalBody,
  Container,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from './ModelDeleteModal.style';
import { Button, Modal, TextField, Typography } from '@mui/material';

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
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBody>
          <ModalHeader>
            <Typography variant="h5">Delete Model</Typography>
          </ModalHeader>
          <ModalContent>
            <Typography variant="body1">
              지울 모델 이름을 정확히 입력해주세요.
            </Typography>
            <Typography variant="h6" color={modelNameColor}>
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
              <Button onClick={handleClose}>Cancel</Button>
              <Button
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
          </ModalContent>
        </ModalBody>
      </Modal>
    </Container>
  );
}
