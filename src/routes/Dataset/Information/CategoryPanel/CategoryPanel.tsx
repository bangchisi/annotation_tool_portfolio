import { Button, TextField } from '@mui/material';
import { Container, InputCategory } from './CategoryPanel.style';
import { useState } from 'react';
import { getTextColor } from 'components/CategoryTag/helpers/CategoryTagHelpers';
import CategoryTag from 'components/CategoryTag/CategoryTag';
import { CategoryType } from 'routes/Dataset/Dataset';

interface CategoryPanelProps {
  categories: CategoryType[];
}

export default function CategoryPanel(props: CategoryPanelProps) {
  const { categories } = props;
  const [addCategoryName, setAddCategoryName] = useState('');

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
        <Button color="primary">Add</Button>
      </InputCategory>
      {categories.map((category) => {
        const textcolor = getTextColor(category.color);
        return (
          <CategoryTag
            key={category.categoryId + category.name}
            categoryName={category.name}
            categorycolor={category.color}
            textcolor={textcolor}
          />
        );
      })}
    </Container>
  );
}
