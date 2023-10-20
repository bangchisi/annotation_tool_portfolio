import { Container } from './ImageList.style';

interface ImageListProps {
  // getDataset: (datasetId: number) => Promise<void>;
  imageIds: number[][];
}

export default function ImageList(props: ImageListProps) {
  const { imageIds } = props;
  return <Container>{imageIds}</Container>;
}
