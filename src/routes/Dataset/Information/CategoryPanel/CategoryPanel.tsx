import { Button, TextField } from '@mui/material';
import { Container, InputCategory } from './CategoryPanel.style';
import { useState } from 'react';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import CategoryTag from 'components/CategoryTag/CategoryTag';
import { CategoryType } from 'routes/Dataset/Dataset';
import axios from 'axios';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import DatasetModel from 'routes/Dataset/models/Dataset.model';

interface CategoryPanelProps {
  categories: CategoryType[];
  handleCategoryDeleted: () => void;
}

export default function CategoryPanel(props: CategoryPanelProps) {
  const { categories, handleCategoryDeleted } = props;
  const [addCategoryName, setAddCategoryName] = useState('');

  const handleCategoryTagClick = async (categoryId: number) => {
    try {
      // await API Call
      const response = await DatasetModel.deleteCategory(categoryId);
      if (response.status !== 200) throw new Error('Failed to delete category');

      handleCategoryDeleted();
    } catch (error) {
      // Axios Handler
      axiosErrorHandler(error, `Failed to delete category: ${categoryId}`);
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
