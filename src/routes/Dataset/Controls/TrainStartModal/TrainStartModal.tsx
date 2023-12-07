import { Button, TextField, Typography } from '@mui/material';
import DeferComponent from 'components/DeferComponent';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ModalWrapper, { useModal } from 'components/ModalWrapper/ModalWrapper';
import { Fragment, useCallback } from 'react';
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
  isDeviceLoading: boolean;
  setDeviceStatus: () => Promise<void>;
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
    setDeviceStatus,
  } = props;

  const firstAvailableDeviceId = Object.entries(availableDevices || {}).find(
    ([id, available]) => available,
  )?.[0];

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

  return (
    <Container>
      <TrainModelButton
        onClick={handleOpen}
        className="train-model-button"
        disableFocusRipple={true}
      >
        TRAIN MODEL
      </TrainModelButton>
      {isDeviceLoading ? (
        <DeferComponent delay={150}>
          <LoadingSpinner message="loading finetune..." />
        </DeferComponent>
      ) : (
        <ModalWrapper open={open} handleClose={handleClose} title="Train Model">
          <div>
            {availableDevices && (
              <Fragment>
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
                    {!firstAvailableDeviceId && <Button disabled>BUSY</Button>}
                    {firstAvailableDeviceId && (
                      <Button
                        key={firstAvailableDeviceId}
                        onClick={() => {
                          if (!baseModelName || !finetuneName) {
                            alert('new model name은 필수 값입니다.');
                            return;
                          }
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
        </ModalWrapper>
      )}
    </Container>
  );
}
