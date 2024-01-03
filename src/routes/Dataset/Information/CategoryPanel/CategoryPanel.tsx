import { Button, TextField } from '@mui/material';
import CategoryTag from 'components/CategoryTag/CategoryTag';
import {
  getRandomHexColor,
  getTextColor,
} from 'components/CategoryTag/helpers/CategoryTagHelpers';
import { axiosErrorHandler, typedAxios } from 'helpers/Axioshelpers';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryType } from 'routes/Dataset/Dataset';
import { Container, InputCategory } from './CategoryPanel.style';
import { useTypedSWRMutation } from 'hooks';
import useSWRMutation from 'swr/mutation';

interface CategoryPanelProps {
  categories: CategoryType[];
}

export default function CategoryPanel(props: CategoryPanelProps) {
  const datasetId = Number(useParams().datasetId);
  const { categories } = props;
  const [addCategoryName, setAddCategoryName] = useState('');

  const { trigger: addCategory } = useTypedSWRMutation(
    {
      method: 'post',
      endpoint: `/dataset/category/${datasetId}`,
      key: `/dataset/${datasetId}`,
    },
    {
      name: addCategoryName,
      color: getRandomHexColor(),
    },
  );

  const { trigger: deleteCategory } = useSWRMutation(
    `/dataset/${datasetId}`,
    async (url, { arg }: { arg: { categoryId: number } }) => {
      try {
        await typedAxios('delete', `/dataset/category/${arg.categoryId}`);
      } catch (error) {
        console.log(error);
      }
    },
  );

  const handleCategoryTagClick = async (categoryId: number) => {
    const isDelete = window.confirm(
      '카테고리를 삭제하시겠습니까? 관련 annotation이 모두 삭제됩니다.',
    );
    if (!isDelete) return;
    try {
      await deleteCategory({ categoryId });
    } catch (error) {
      axiosErrorHandler(error, `Failed to delete category: ${categoryId}`);
    }
  };

  const onAddCategory = async () => {
    if (addCategoryName === '') return;

    try {
      await addCategory();
    } catch (error) {
      axiosErrorHandler(error, 'Failed to add category');
      alert('중복된 카테고리 이름입니다.');
    } finally {
      setAddCategoryName('');
    }
  };

  return (
    <Container>
      <InputCategory>
        <TextField
          label="add category"
          variant="outlined"
          value={addCategoryName}
          size="small"
          onChange={(e) => {
            setAddCategoryName(e.target.value);
          }}
        ></TextField>
        <Button
          color="primary"
          sx={{
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
          onClick={onAddCategory}
        >
          Add
        </Button>
      </InputCategory>
      {categories.map((category) => {
        const textcolor = getTextColor(category.color);
        return (
          <CategoryTag
            key={category.categoryId + category.name}
            categoryName={category.name}
            categorycolor={category.color}
            textcolor={textcolor}
            onClick={() => handleCategoryTagClick(category.categoryId)}
          />
        );
      })}
    </Container>
  );
}
