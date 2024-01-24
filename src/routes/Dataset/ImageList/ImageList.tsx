import ImageCard from './ImageCard/ImageCard';
import { Container } from './ImageList.style';

// ImageList 컴포넌트 props 타입
interface ImageListProps {
  // getDataset: (datasetId: number) => Promise<void>;
  imageIds: number[]; // 이미지 ID 목록
  deleteImage: (imageId: number) => Promise<void>; // 이미지 삭제 함수
  isOnTrain: boolean; // 학습 중인지 여부
}

// ImageList 컴포넌트
export default function ImageList(props: ImageListProps) {
  const { imageIds, deleteImage, isOnTrain } = props;

  return (
    <Container>
      {/* 이미지 목록 렌더링 */}
      {imageIds &&
        imageIds.map((imageId) => {
          return (
            // 이미지 카드 컴포넌트
            <ImageCard
              key={imageId}
              imageId={imageId}
              deleteImage={deleteImage}
              isOnTrain={isOnTrain}
            />
          );
        })}
    </Container>
  );
}
