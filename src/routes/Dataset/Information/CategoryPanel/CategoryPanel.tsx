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

// 카테고리 패널 props 타입
interface CategoryPanelProps {
  categories: CategoryType[]; // 카테고리 목록
}

// 카테고리 패널 컴포넌트
export default function CategoryPanel(props: CategoryPanelProps) {
  const datasetId = Number(useParams().datasetId); // 데이터셋 ID
  const { categories } = props;
  const [addCategoryName, setAddCategoryName] = useState(''); // 추가할 카테고리 이름

  // 카테고리 추가 요청
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

  // 카테고리 삭제 요청
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

  // 카테고리 태그 버튼 클릭 핸들러
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

  // 카테고리 추가 버튼 클릭 핸들러
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
        {/* 추가할 카테고리 이름 입력 */}
        <TextField
          label="add category"
          variant="outlined"
          value={addCategoryName}
          size="small"
          onChange={(e) => {
            setAddCategoryName(e.target.value);
          }}
        ></TextField>
        {/* 카테고리 추가 버튼 */}
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
      {/* 카테고리 태그 목록 */}
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
