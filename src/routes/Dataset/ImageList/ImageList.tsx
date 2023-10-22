import ImageCard from './ImageCard/ImageCard';
import { Container } from './ImageList.style';

interface ImageListProps {
  // getDataset: (datasetId: number) => Promise<void>;
  imageIds: number[];
}

export default function ImageList(props: ImageListProps) {
  const { imageIds } = props;
  console.dir(imageIds);
  return (
    <Container>
      {imageIds.map((imageId) => {
        return <ImageCard key={imageId} imageId={imageId} />;
      })}
    </Container>
  );
}
