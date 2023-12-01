import { getImagePath } from 'helpers/ImagesHelpers';
import {
  Container,
  ImageContainer,
  ImageLink,
  Title,
  TitleContainer,
} from './ImageCard.style';
import { Button } from '@mui/material';
import ComponentBlocker from 'components/ComponentBlocker/ComponentBlocker';
import { useEffect, useState } from 'react';
import ImagesModel from 'models/Images.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';

interface ImageCardProps {
  imageId: number;
  deleteImage: (imageId: number) => Promise<void>;
  isOnTrain: boolean;
}

interface ImageInfo {
  isAnnotated: boolean;
  filename: string;
}

export default function ImageCard(props: ImageCardProps) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(undefined);
  const { imageId, deleteImage, isOnTrain } = props;

  const imagePath = getImagePath(Number(imageId), 200);
  const link = `/annotator/${imageId}`;

  // @이슈: 이미지 이름 가져오려고 했는데,
  // 너무 비효율적인 방법임. 초기에 이미지 이름까지 같이 받아서 처리해야함.
  useEffect(() => {
    const fetchImageInfo = async () => {
      try {
        const response = await ImagesModel.getImageInfo(imageId);

        if (response.status !== 200) {
          throw new Error('이미지 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.data;
        if (data) {
          setImageInfo(data);
        } else {
          setImageInfo(undefined);
        }
      } catch (error) {
        axiosErrorHandler(error, '이미지 정보를 가져오는데 실패했습니다.');
      }
    };

    fetchImageInfo();
  }, [imageId]);

  return (
    <Container>
      {isOnTrain && <ComponentBlocker message="현재 학습중인 이미지입니다." />}
      <ImageLink to={link}>
        <ImageContainer>
          <img src={imagePath} />
        </ImageContainer>
        <TitleContainer>
          <Title>
            {imageInfo === undefined
              ? // 초기 이미지 제목은 빈 문자열로 설정
                ''
              : // 이미지 정보 가져오기 이후 있으면 이미지 이름을 표시
                imageInfo?.filename || 'No Image Name'}
          </Title>
        </TitleContainer>
      </ImageLink>
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
