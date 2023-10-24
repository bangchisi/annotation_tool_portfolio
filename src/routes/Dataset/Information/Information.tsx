import { Button, Typography } from '@mui/material';
import { Container } from './Information.style';
import { DatasetType } from '../Dataset';
import { getFormattedDate } from 'helpers/DateHelpers';
import CategoryPanel from './CategoryPanel/CategoryPanel';

export default function Information(props: DatasetType) {
  const { datasetName, created, description, categories } = props;
  return (
    <Container>
      <Typography variant="h6">
        {datasetName}
        <Button color="secondary">...</Button>
      </Typography>

      <Typography variant="subtitle2">
        created {getFormattedDate(created)}
      </Typography>
      <Typography variant="h6">Description</Typography>
      <div>{description}</div>
      <CategoryPanel categories={categories} />
      {/* <div>
        <div>
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
        </div>
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
      </div> */}
    </Container>
  );
}
