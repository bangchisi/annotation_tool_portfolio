import { Button, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import {
  Container,
  FieldContainer,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalShadow,
  ModalShadowContainer,
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

  const [open, setOpen] = useState(false);
  let debounceTimerId: NodeJS.Timeout;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setBaseModelName('vit_l');
    setFinetuneName('');
  };

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={true}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 350,
          },
        }}
      >
        <ModalShadowContainer>
          <ModalShadow>
            <ModalBody>
              <ModalHeader>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: '22px',
                  }}
                >
                  Train Model
                </Typography>
              </ModalHeader>
              <ModalContent>
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
              </ModalContent>
            </ModalBody>
          </ModalShadow>
        </ModalShadowContainer>
      </Modal>
    </Container>
  );
}
