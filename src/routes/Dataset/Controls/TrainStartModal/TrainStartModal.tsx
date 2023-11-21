import { Fragment, useState } from 'react';
import {
  CreateButton,
  ModalBody,
  Container,
  ModalHeader,
  ModalContent,
  ModalFooter,
  TrainContainer,
  SelectField,
} from './TrainStartModal.style';
import { Button, MenuItem, Modal, TextField, Typography } from '@mui/material';

interface TrainStartModalModalProps {
  baseModelName: string;
  setBaseModelName: React.Dispatch<React.SetStateAction<string>>;
  finetuneName: string;
  setFinetuneName: React.Dispatch<React.SetStateAction<string>>;
  datasetId: number;
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
  } = props;

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
      <CreateButton onClick={handleOpen}>TRAIN MODEL</CreateButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBody>
          <ModalHeader>
            <Typography variant="h5">Train Model</Typography>
          </ModalHeader>
          <ModalContent>
            <div>
              {availableDevices && (
                <Fragment>
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
                    <MenuItem value="vit_b">
                      vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_vit_b_
                    </MenuItem>
                  </SelectField>
                  <Typography>New Model Name</Typography>
                  <TextField
                    type="text"
                    value={finetuneName}
                    size="small"
                    onChange={(event) => {
                      setFinetuneName(event.target.value);
                    }}
                  ></TextField>
                  <Typography>Directory</Typography>
                  <TextField
                    type="text"
                    value={`/${baseModelName}/${finetuneName}`}
                    disabled
                    size="small"
                  />
                  <TrainContainer>
                    {Object.entries(availableDevices).map(([id, device]) => {
                      const deviceId = Number(id);
                      return (
                        <Button
                          key={deviceId}
                          disabled={!device}
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
                              deviceId,
                              baseModelName,
                              finetuneName,
                            );
                            handleClose();
                          }}
                        >
                          {device ? `TRAIN (device ${deviceId})` : 'BUSY'}
                        </Button>
                      );
                    })}
                  </TrainContainer>
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
      </Modal>
    </Container>
  );
}
