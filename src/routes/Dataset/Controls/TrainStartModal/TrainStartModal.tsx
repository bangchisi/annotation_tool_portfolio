import { Button, TextField, Typography } from '@mui/material';
import ModalWrapper, { useModal } from 'components/ModalWrapper/ModalWrapper';
import { useCallback } from 'react';
import {
  Container,
  FieldContainer,
  ModalFooter,
  TrainModelButton,
} from './TrainStartModal.style';

// TrainStartModal 컴포넌트 props 타입
interface TrainStartModalModalProps {
  baseModelName: string; // 기반 모델 이름
  setBaseModelName: React.Dispatch<React.SetStateAction<string>>; // 기반 모델 이름을 변경하는 함수
  finetuneName: string; // 생성할 모델 이름
  setFinetuneName: React.Dispatch<React.SetStateAction<string>>; // 생성할 모델 이름을 변경하는 함수
  datasetId: number; // 데이터셋 고유 ID
  // 학습 시작 함수
  onTrainStart: (
    datasetId: number, // 데이터셋 고유 ID
    modelType: string, // 기반 모델 이름
    finetuneName: string, // 생성할 모델 이름
  ) => Promise<void>;
}

// TrainStartModal 컴포넌트
export default function TrainStartModal(props: TrainStartModalModalProps) {
  const {
    baseModelName,
    setBaseModelName,
    finetuneName,
    setFinetuneName,
    datasetId,
    onTrainStart,
  } = props; // props 디스트럭처링

  // 디바운싱을 위한 타이머 ID
  let debounceTimerId: NodeJS.Timeout;

  const { open, handleOpen: onOpen, handleClose: onClose } = useModal(); // 모달 커스텀 훅

  // 모달이 닫힐 때 form 초기화
  const resetForm = useCallback(() => {
    setBaseModelName('vit_l'); // 기반 모델 이름 초기화.
    setFinetuneName(''); // 생성할 모델 이름 초기화
  }, [setBaseModelName, setFinetuneName]);

  // 모달 열기
  const handleOpen = useCallback(() => {
    onOpen();
  }, [onOpen]);

  // 모달 닫기
  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  // 학습 시작 버튼 클릭 이벤트 핸들러
  const onClickTrainButton = () => {
    // 디바운싱 처리
    clearTimeout(debounceTimerId);

    // 디바운싱 간격은 300ms
    debounceTimerId = setTimeout(() => {
      if (!baseModelName || !finetuneName) {
        alert('new model name은 필수 값입니다.');
        return;
      }
      // 학습 시작
      onTrainStart(datasetId, baseModelName, finetuneName);
      // 모달 닫기
      handleClose();
    }, 300);
  };

  // 렌더링
  return (
    <Container>
      {/* 학습 시작 버튼 */}
      <TrainModelButton
        onClick={handleOpen}
        className="train-model-button train-step"
        disableFocusRipple={true}
      >
        TRAIN MODEL
      </TrainModelButton>
      {/* 학습 모달 */}
      <ModalWrapper open={open} handleClose={handleClose} title="Train Model">
        <div>
          <FieldContainer>
            {/* 생성할 모델 이름 입력란 */}
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
            {/* 디렉터리 표시 */}
            <Typography>Directory</Typography>
            <TextField
              type="text"
              value={`/${baseModelName}/${finetuneName}`}
              disabled
              size="small"
            />
          </FieldContainer>
        </div>
        <ModalFooter>
          {/* 취소 버튼 */}
          <Button
            className="close-modal-button"
            color="warning"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {/* 학습 시작 버튼 */}
          <Button onClick={onClickTrainButton}>TRAIN</Button>
        </ModalFooter>
      </ModalWrapper>
    </Container>
  );
}
