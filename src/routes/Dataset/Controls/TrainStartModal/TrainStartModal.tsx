import { Button, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import {
  Container,
  FieldContainer,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalShadow,
  ModalShadowContainer,
  SelectField,
  TrainContainer,
  TrainModelButton,
} from './TrainStartModal.style';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

interface TrainStartModalModalProps {
  baseModelName: string;
  setBaseModelName: React.Dispatch<React.SetStateAction<string>>;
  finetuneName: string;
  setFinetuneName: React.Dispatch<React.SetStateAction<string>>;
  datasetId: number;
  isDeviceLoading: boolean;
  onTrainStart: (
    datasetId: number,
    deviceId: number,
    modelType: string,
    finetuneName: string,
  ) => Promise<void>;
  availableDevices:
    | {
        [key: number]: boolean;
      }
    | undefined;
}

export default function TrainStartModal(props: TrainStartModalModalProps) {
  const {
    baseModelName,
    setBaseModelName,
    finetuneName,
    setFinetuneName,
    datasetId,
    onTrainStart,
    availableDevices,
    isDeviceLoading,
  } = props;

  const firstAvailableDeviceId = Object.entries(availableDevices || {}).find(
    ([id, available]) => available,
  )?.[0];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setBaseModelName('vit_l');
    setFinetuneName('');
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
                {isDeviceLoading && (
                  <LoadingSpinner message="loading finetune..." />
                )}
                <div>
                  {availableDevices && (
                    <Fragment>
                      <FieldContainer>
                        <Typography>Base Model Name</Typography>
                        <SelectField
                          defaultValue="vit_l"
                          value={baseModelName}
                          size="small"
                          onChange={(event) => {
                            setBaseModelName(event.target.value as string);
                          }}
                        >
                          <MenuItem value="vit_l">vit_l</MenuItem>
                          <MenuItem value="vit_b">vit_b</MenuItem>
                        </SelectField>
                      </FieldContainer>
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
                          {!firstAvailableDeviceId && (
                            <Button disabled>BUSY</Button>
                          )}
                          {firstAvailableDeviceId && (
                            <Button
                              key={firstAvailableDeviceId}
                              onClick={() => {
                                if (!baseModelName || !finetuneName) {
                                  alert(
                                    'base model name과 new model name은 필수 값입니다.',
                                  );
                                  return;
                                }
                                alert(
                                  `${baseModelName} 기반 ${finetuneName} 모델 학습을 시작했습니다.`,
                                );
                                onTrainStart(
                                  datasetId,
                                  Number(firstAvailableDeviceId),
                                  baseModelName,
                                  finetuneName,
                                );
                                handleClose();
                              }}
                            >
                              TRAIN
                            </Button>
                          )}
                        </TrainContainer>
                      </FieldContainer>
                    </Fragment>
                  )}
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
