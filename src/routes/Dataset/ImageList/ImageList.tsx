import ImageCard from './ImageCard/ImageCard';
import { Container } from './ImageList.style';

interface ImageListProps {
  // getDataset: (datasetId: number) => Promise<void>;
  imageIds: number[];
  deleteImage: (imageId: number) => Promise<void>;
  isOnTrain: boolean;
}

export default function ImageList(props: ImageListProps) {
  const { imageIds, deleteImage, isOnTrain } = props;
  return (
    <Container>
      {imageIds &&
        imageIds.map((imageId) => {
          return (
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
