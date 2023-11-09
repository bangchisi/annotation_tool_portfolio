import { getImagePath } from 'helpers/ImagesHelpers';
import { Container } from './ImageCard.style';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface ImageCardProps {
  imageId: number;
  deleteImage: (imageId: number) => Promise<void>;
}

export default function ImageCard(props: ImageCardProps) {
  const { imageId, deleteImage } = props;

  const imagePath = getImagePath(Number(imageId), 200);
  const link = `/annotator/${imageId}`;
  return (
    <Container>
      <Link to={link}>
        <img src={imagePath} />
        <div>이미지 이름 (id: {imageId})</div>
      </Link>
      <Button onClick={() => deleteImage(imageId)}>delete</Button>
    </Container>
  );
}
