import { Button } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import { useCallback, useState } from 'react';
import {
  Container,
  CreateButton,
  InputField,
  ModalFooter,
} from './CreateDatasetModal.style';

import CategoryTag from 'components/CategoryTag/CategoryTag';
import {
  getRandomHexColor,
  getTextColor,
} from 'components/CategoryTag/helpers/CategoryTagHelpers';
import ModalWrapper, { useModal } from 'components/ModalWrapper/ModalWrapper';
import { KeyedMutator } from 'swr';
import { DatasetType } from 'routes/Datasets/Datasets';

// CreateDatasetModal 컴포넌트 props 타입
interface CreateDatasetModalProps {
  updateDatasets: KeyedMutator<DatasetType[]>; // 데이터셋 목록 업데이트 함수
}

// CreateDatasetModal 컴포넌트
export default function CreateDatasetModal(props: CreateDatasetModalProps) {
  const user = useAppSelector((state) => state.auth.user); // 현재 로그인한 유저 정보
  const { updateDatasets } = props; // 데이터셋 목록 업데이트 함수

  const [datasetName, setDatasetName] = useState<string>(''); // 데이터셋 이름
  const [addCategoryName, setAddCategoryName] = useState<string>(''); // 카테고리 추가를 위한 카테고리 이름
  const [description, setDescription] = useState<string>(''); // 데이터셋 설명
  const [categories, setCategories] = useState<string[][]>([]); // 카테고리 목록
  const [superDatasetName, setSuperDatasetName] = useState<string>(''); // 대분류 이름

  // 모달을 위한 커스텀 훅
  const { open, handleOpen, handleClose: onClose } = useModal();

  // 카테고리 추가 함수
  const addCategory = (categoryName: string): void => {
    // 카테고리 이름이 없으면 종료
    if (!categoryName) return;

    // 카테고리 이름이 이미 존재하면 종료
    if (categories.find((category) => category[0] === categoryName)) {
      alert('이미 존재하는 카테고리입니다.');
      setAddCategoryName('');
      return;
    }

    const color = getRandomHexColor(); // 랜덤 색상 생성
    const newCategory = [categoryName, color]; // 새로운 카테고리

    // 카테고리 목록에 새로운 카테고리 추가
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    // 카테고리 추가 입력창 초기화
    setAddCategoryName('');
  };

  // 카테고리 삭제 함수
  const deleteCategory = (categoryName: string): void => {
    setCategories((prevCategories) =>
      // 카테고리 이름이 일치하지 않는 카테고리만 남긴 결과를 return
      prevCategories.filter((category) => category[0] !== categoryName),
    );
  };

  // 데이터셋 생성 함수
  const createDataset = async (
    userId: string, // 유저 아이디
    datasetName: string, // 데이터셋 이름
    categories: string[][], // 카테고리 목록
    description: string, // 데이터셋 설명
    superDatasetName: string, // 대분류 이름
  ) => {
    try {
      // 데이터셋 생성 요청
      await typedAxios('POST', '/dataset', {
        user_id: userId,
        dataset_name: datasetName,
        categories,
        description,
        superdataset_name: superDatasetName,
      });

      // 모달 닫기
      handleClose();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create dataset');
      alert('Dataset 생성 실패. Dataset 이름이 너무 깁니다 (45자 이하)');
    } finally {
      // 데이터셋 목록 업데이트
      updateDatasets();
    }
  };

  // 모달 닫을 때 폼 초기화 함수
  const resetForm = () => {
    setSuperDatasetName('');
    setDatasetName('');
    setAddCategoryName('');
    setDescription('');
    setCategories([]);
  };

  // 모달 닫기 함수
  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose]);

  // 렌더링
  return (
    <Container>
      {/* 데이터셋 생성 버튼 */}
      <CreateButton
        disableFocusRipple={true}
        onClick={handleOpen}
        className="create-dataset-button create-dataset-step"
      >
        Create Dataset
      </CreateButton>
      {/* 데이터셋 생성 모달 */}
      <ModalWrapper
        open={open}
        handleClose={handleClose}
        title="Create Dataset"
      >
        {/* 대분류 이름 입력 */}
        <InputField
          label="Super Dataset Name"
          variant="outlined"
          size="small"
          value={superDatasetName}
          onChange={(e) => {
            setSuperDatasetName(e.target.value);
          }}
          required
        />
        {/* 데이터셋 이름 입력 */}
        <InputField
          label="Dataset Name"
          variant="outlined"
          size="small"
          value={datasetName}
          onChange={(e) => {
            setDatasetName(e.target.value);
          }}
          required
        />
        {/* 데이터셋 설명 입력 */}
        <InputField
          label="description"
          variant="outlined"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          size="small"
          multiline
        />
        {/* 데이터셋 경로 */}
        <InputField
          variant="outlined"
          value={`/datasets/${superDatasetName}/${datasetName}`}
          disabled
          size="small"
        />
        {/* 카테고리 추가 */}
        <div>
          {/* 카테고리 이름 입력창 */}
          <InputField
            label="add category"
            variant="outlined"
            value={addCategoryName}
            size="small"
            onChange={(e) => {
              setAddCategoryName(e.target.value);
            }}
          ></InputField>
          {/* 카테고리 추가 버튼 */}
          <Button
            onClick={() => addCategory(addCategoryName)}
            color="primary"
            sx={{
              height: '40px',
            }}
          >
            Add
          </Button>
        </div>
        {/* 카테고리 목록 */}
        <div>
          {categories.map((category) => {
            const textcolor = getTextColor(category[1]);
            return (
              <CategoryTag
                key={category[0] + category[1]}
                categoryName={category[0]}
                categorycolor={category[1]}
                textcolor={textcolor}
                onClick={() => deleteCategory(category[0])}
              />
            );
          })}
        </div>
        <ModalFooter>
          {/* 닫기 버튼 */}
          <Button
            className="close-modal-button"
            color="warning"
            onClick={handleClose}
          >
            Cancel
          </Button>
          {/* 생성 버튼 */}
          <Button
            onClick={async () => {
              // 데이터셋 이름이 없으면 종료
              if (!datasetName) {
                alert('Dataset 이름은 필수입니다.');
                return;
              }

              // 데이터셋 생성
              createDataset(
                user.userId,
                datasetName,
                categories,
                description,
                superDatasetName,
              );

              // 카테고리 목록 배열 초기화
              setCategories([]);
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalWrapper>
    </Container>
  );
}
