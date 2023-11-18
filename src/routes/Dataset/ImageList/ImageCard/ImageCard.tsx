import { getImagePath } from 'helpers/ImagesHelpers';
import { Container } from './ImageCard.style';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';

interface ImageCardProps {
  imageId: number;
  deleteImage: (imageId: number) => Promise<void>;
  isOnTrain: boolean;
}

export default function ImageCard(props: ImageCardProps) {
  const { imageId, deleteImage, isOnTrain } = props;

  const imagePath = getImagePath(Number(imageId), 200);
  const link = `/annotator/${imageId}`;
  return (
    <Container>
      {isOnTrain && <ComponentBlocker message="현재 학습중인 이미지입니다." />}
      <Link to={link}>
        <img src={imagePath} />
        <div>이미지 이름 (id: {imageId})</div>
      </Link>
      <Button onClick={() => deleteImage(imageId)}>delete</Button>
    </Container>
  );
}
