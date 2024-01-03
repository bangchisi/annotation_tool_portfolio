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

interface CreateDatasetModalProps {
  updateDatasets: KeyedMutator<DatasetType[]>;
}

export default function CreateDatasetModal(props: CreateDatasetModalProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { updateDatasets } = props;

  const [datasetName, setDatasetName] = useState<string>('');
  const [addCategoryName, setAddCategoryName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categories, setCategories] = useState<string[][]>([]);
  const [superDatasetName, setSuperDatasetName] = useState<string>('');

  const { open, handleOpen, handleClose: onClose } = useModal();

  const addCategory = (categoryName: string): void => {
    if (!categoryName) return;
    if (categories.find((category) => category[0] === categoryName)) {
      alert('이미 존재하는 카테고리입니다.');
      setAddCategoryName('');
      return;
    }
    const color = getRandomHexColor();
    const newCategory = [categoryName, color];
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setAddCategoryName('');
  };

  const deleteCategory = (categoryName: string): void => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category[0] !== categoryName),
    );
  };

  const createDataset = async (
    userId: string,
    datasetName: string,
    categories: string[][],
    description: string,
    superDatasetName: string,
  ) => {
    try {
      await typedAxios('POST', '/dataset', {
        user_id: userId,
        dataset_name: datasetName,
        categories,
        description,
        superdataset_name: superDatasetName,
      });

      handleClose();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create dataset');
      alert('Dataset 생성 실패. Dataset 이름이 너무 깁니다 (45자 이하)');
    } finally {
      updateDatasets();
    }
  };

  const resetForm = () => {
    setSuperDatasetName('');
    setDatasetName('');
    setAddCategoryName('');
    setDescription('');
    setCategories([]);
  };

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose]);

  return (
    <Container>
      <CreateButton
        disableFocusRipple={true}
        onClick={handleOpen}
        className="create-dataset-button create-dataset-step"
      >
        Create Dataset
      </CreateButton>
      <ModalWrapper
        open={open}
        handleClose={handleClose}
        title="Create Dataset"
      >
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
        <InputField
          variant="outlined"
          value={`/datasets/${superDatasetName}/${datasetName}`}
          disabled
          size="small"
        />
        <div>
          <InputField
            label="add category"
            variant="outlined"
            value={addCategoryName}
            size="small"
            onChange={(e) => {
              setAddCategoryName(e.target.value);
            }}
          ></InputField>
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
          <Button
            className="close-modal-button"
            color="warning"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!datasetName) {
                alert('Dataset 이름은 필수입니다.');
                return;
              }
              createDataset(
                user.userId,
                datasetName,
                categories,
                description,
                superDatasetName,
              );
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
