import { useEffect, useState } from 'react';
import { DatasetType } from '../Datasets';
import {
  Container,
  TitleContainer,
  ImageContainer,
  StatusContainer,
  CategoriesContainer,
  ProgressContainer,
  MenuButtonContainer,
} from './DatasetCard.style';
import { getThumbnail } from 'helpers/ImagesHelpers';
import { Button, Typography } from '@mui/material';
import { useAppSelector } from 'App.hooks';
import { Link } from 'react-router-dom';

export default function DatasetCard(props: DatasetType) {
  const user = useAppSelector((state) => state.auth.user);
  const { datasetId, datasetName, created, lastUpdate, categories, progress } =
    props;
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    // setThumbnail(datasetId, 200);
    getThumbnail(datasetId, 200).then((response) => {
      if (!response) return;
      setImgPath(response);
    });
  }, [datasetId]);

  return (
    <Container>
      <ImageContainer>
        <Link to={'/dataset/' + datasetId}>
          <img src={imgPath} />
        </Link>
      </ImageContainer>
      <TitleContainer>
        <Typography variant="h5">{datasetName}</Typography>
        <div>created by {user.userName}</div>
        <div>{created}</div>
        <div>update: {lastUpdate}</div>
      </TitleContainer>
      <StatusContainer>
        <CategoriesContainer>
          {categories.map((category) => (
            <button key={category.categoryId}>{category.name}</button>
          ))}
        </CategoriesContainer>
        <ProgressContainer>{progress}</ProgressContainer>
      </StatusContainer>
      <MenuButtonContainer>
        <Button variant="text">...</Button>
      </MenuButtonContainer>
    </Container>
  );
}
