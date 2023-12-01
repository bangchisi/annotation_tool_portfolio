import { useState } from 'react';
import {
  CreateButton,
  ModalBody,
  Container,
  ModalHeader,
  ModalContent,
  ModalFooter,
  InputField,
  ModalShadow,
  ModalShadowContainer,
} from './CreateDatasetModal.style';
import { Button, Modal, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import DatasetsModel from '../../models/Datasets.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';

import {
  getRandomHexColor,
  getTextColor,
} from 'components/CategoryTag/helpers/CategoryTagHelpers';
import CategoryTag from 'components/CategoryTag/CategoryTag';

interface CreateDatasetModalProps {
  setDatasetList: (userId: string) => Promise<void>;
}

export default function CreateDatasetModal(props: CreateDatasetModalProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { setDatasetList } = props;

  const [open, setOpen] = useState(false);
  const [datasetName, setDatasetName] = useState<string>('');
  const [addCategoryName, setAddCategoryName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categories, setCategories] = useState<string[][]>([]);
  const [superDatasetName, setSuperDatasetName] = useState<string>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const addCategory = (categoryName: string): void => {
    if (!categoryName) return;
    const color = getRandomHexColor();
    const newCategory = [categoryName, color];
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setAddCategoryName('');
  };

  const createDataset = async (
    userId: string,
    datasetName: string,
    categories: string[][],
    description: string,
  ) => {
    try {
      await DatasetsModel.createDataset(
        userId,
        datasetName,
        categories,
        description,
        superDatasetName,
      );

      handleClose();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create dataset');
      alert('Dataset 생성 실패.');
    } finally {
      setDatasetList(userId);
    }
  };

  const resetForm = () => {
    setSuperDatasetName('');
    setDatasetName('');
    setAddCategoryName('');
    setDescription('');
    setCategories([]);
  };

  return (
    <Container>
      <CreateButton
        disableFocusRipple={true}
        onClick={handleOpen}
        className="create-dataset-button"
      >
        Create Dataset
      </CreateButton>
      <Modal
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
                  Create Dataset
                </Typography>
              </ModalHeader>
              <ModalContent>
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
                      />
                    );
                  })}
                </div>
                <ModalFooter>
                  <Button color="warning" onClick={handleClose}>
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
                      );
                      setCategories([]);
                    }}
                  >
                    Create
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
