import { useState } from 'react';
import {
  CreateButton,
  ModalBody,
  Container,
  ModalHeader,
  ModalContent,
  ModalFooter,
  CategoryTag,
} from './CreateDatasetModal.style';
import { Button, Modal, TextField, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import DatasetsModel from '../models/Datasets.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import axios from 'axios';

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getRandomHexColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return hexColor;
  };

  const getTextColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness > 128) {
      return '#000000';
    } else {
      return '#ffffff';
    }
  };

  const addCategory = (categoryName: string): void => {
    const color = getRandomHexColor();
    const newCategory = [categoryName, color];
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const createDataset = async (
    userId: string,
    datasetName: string,
    categories: string[][],
    description: string,
  ) => {
    try {
      const response = await DatasetsModel.createDataset(
        userId,
        datasetName,
        categories,
        description,
      );

      handleClose();
      console.dir(response);
    } catch (error) {
      axiosErrorHandler(error, 'Failed to create dataset');
      alert('Dataset 생성 실패.');
    } finally {
      setDatasetList(user.userId);
    }
  };

  return (
    <Container>
      <CreateButton onClick={handleOpen}>Create Dataset</CreateButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBody>
          <ModalHeader>
            <Typography variant="h5">Create Dataset</Typography>
          </ModalHeader>
          <ModalContent>
            <TextField
              label="Dataset Name"
              variant="outlined"
              onChange={(e) => {
                setDatasetName(e.target.value);
              }}
              required
            />
            <TextField
              label="description"
              variant="outlined"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              multiline
            />
            <div>
              <TextField
                label="add category"
                variant="outlined"
                value={addCategoryName}
                onChange={(e) => {
                  setAddCategoryName(e.target.value);
                }}
              ></TextField>
              <Button
                onClick={() => addCategory(addCategoryName)}
                color="primary"
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
                    categorycolor={category[1]}
                    textcolor={textcolor}
                  >
                    {category[0]}
                  </CategoryTag>
                );
              })}
            </div>
            <ModalFooter>
              <button
                color="info"
                onClick={async () => {
                  // datasets 확인용
                  const datasets = await axios.get(
                    `http://143.248.249.11:60133/dataset/${user.userId}/datasets`,
                  );

                  console.log('dataset list');
                  console.dir(datasets.data.data);
                }}
              >
                check Dataset list
              </button>
              <Button color="warning">Cancel</Button>
              <Button
                onClick={async () => {
                  console.dir(user.userId);
                  console.log('dataset name: ', datasetName);
                  console.log('categories: ');
                  console.dir(categories);
                  console.log('description: ', description);
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
      </Modal>
    </Container>
  );
}
