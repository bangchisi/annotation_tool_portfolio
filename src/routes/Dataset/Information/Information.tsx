import { Button } from '@mui/material';
import { Container } from './Information.style';
import { DatasetType } from '../Dataset';

export default function Information(props: DatasetType) {
  const { datasetName, created, description, categories } = props;
  return (
    <Container>
      <span>{datasetName}</span>
      <Button color="secondary">...</Button>
      <div>생성 날짜: {created}</div>
      <div>설명: {description}</div>
      <div>
        {categories.map((category) => {
          return <div key={category.categoryId}>{category.name}</div>;
        })}
      </div>
    </Container>
  );
}
