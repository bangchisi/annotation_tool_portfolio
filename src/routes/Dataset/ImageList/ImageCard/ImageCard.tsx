import { getImagePath } from 'helpers/ImagesHelpers';
import { Container, ImageContainer, TitleContainer } from './ImageCard.style';
import { NavLink } from 'react-router-dom';
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
      <NavLink to={link}>
        <ImageContainer>
          <img src={imagePath} />
        </ImageContainer>
        <TitleContainer>
          <span>이미지 이름 (id: {imageId})</span>
        </TitleContainer>
      </NavLink>
      <Button
        onClick={() => deleteImage(imageId)}
        disableFocusRipple={true}
        sx={{
          minWidth: '0px',
          fontSize: '0.8rem',
          padding: '4px 4px',
          justifySelf: 'flex-end',
          alignSelf: 'flex-end',
          marginTop: '6px',
        }}
      >
        삭제
      </Button>
    </Container>
  );
}
