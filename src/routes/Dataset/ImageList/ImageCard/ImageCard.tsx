import { getImagePath } from 'helpers/ImagesHelpers';
import { Container } from './ImageCard.style';
import { Link } from 'react-router-dom';

interface ImageCardProps {
  imageId: number;
}

export default function ImageCard(props: ImageCardProps) {
  const { imageId } = props;

  const imagePath = getImagePath(Number(imageId), 200);
  const link = `/annotator/${imageId}`;
  return (
    <Container>
      <Link to={link}>
        <img src={imagePath} />
        <div>이미지 이름 (id: {imageId})</div>
      </Link>
    </Container>
  );
}
