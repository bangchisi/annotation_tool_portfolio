import ImageCard from './ImageCard/ImageCard';
import { Container } from './ImageList.style';

interface ImageListProps {
  // getDataset: (datasetId: number) => Promise<void>;
  imageIds: number[];
}

export default function ImageList(props: ImageListProps) {
  const { imageIds } = props;
  return (
    <Container>
      {imageIds &&
        imageIds.map((imageId) => {
          return <ImageCard key={imageId} imageId={imageId} />;
        })}
    </Container>
  );
}
