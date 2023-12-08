import { Button, TextField, Typography } from '@mui/material';
import DeferComponent from 'components/DeferComponent';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ModalWrapper, { useModal } from 'components/ModalWrapper/ModalWrapper';
import { useCallback } from 'react';
import {
  Container,
  FieldContainer,
  ModalFooter,
  TrainContainer,
  TrainModelButton,
} from './TrainStartModal.style';

interface TrainStartModalModalProps {
  baseModelName: string;
  setBaseModelName: React.Dispatch<React.SetStateAction<string>>;
  finetuneName: string;
  setFinetuneName: React.Dispatch<React.SetStateAction<string>>;
  datasetId: number;
  onTrainStart: (
    datasetId: number,
    modelType: string,
    finetuneName: string,
  ) => Promise<void>;
}

export default function TrainStartModal(props: TrainStartModalModalProps) {
  const {
    baseModelName,
    setBaseModelName,
    finetuneName,
    setFinetuneName,
    datasetId,
    onTrainStart,
  } = props;

  let debounceTimerId: NodeJS.Timeout;

  const { open, handleOpen: onOpen, handleClose: onClose } = useModal();

  const resetForm = useCallback(() => {
    setBaseModelName('vit_l');
    setFinetuneName('');
  }, [setBaseModelName, setFinetuneName]);

  const handleOpen = useCallback(() => {
    onOpen();
    setDeviceStatus();
  }, [onOpen, setDeviceStatus]);

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const onClickTrainButton = () => {
    clearTimeout(debounceTimerId);

    debounceTimerId = setTimeout(() => {
      if (!baseModelName || !finetuneName) {
        alert('new model name은 필수 값입니다.');
        return;
      }
      onTrainStart(datasetId, baseModelName, finetuneName);
      handleClose();
    }, 300);
  };

  return (
    <Container>
      <TrainModelButton
        onClick={handleOpen}
        className="train-model-button"
        disableFocusRipple={true}
      >
        TRAIN MODEL
      </TrainModelButton>
      <ModalWrapper open={open} handleClose={handleClose} title="Train Model">
        <div>
          <FieldContainer>
            <Typography>New Model Name</Typography>
            <TextField
              type="text"
              value={finetuneName}
              size="small"
              onChange={(event) => {
                setFinetuneName(event.target.value);
              }}
            ></TextField>
          </FieldContainer>
          <FieldContainer>
            <Typography>Directory</Typography>
            <TextField
              type="text"
              value={`/${baseModelName}/${finetuneName}`}
              disabled
              size="small"
            />
            <TrainContainer>
              <Button onClick={onClickTrainButton}>TRAIN</Button>
            </TrainContainer>
          </FieldContainer>
        </div>
        <ModalFooter>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalWrapper>
    </Container>
  );
}
