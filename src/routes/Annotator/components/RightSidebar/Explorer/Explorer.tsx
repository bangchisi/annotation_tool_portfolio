import { Fragment } from 'react';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { Container } from './Explorer.style';

export default function Explorer() {
  interface ImageType {
    url: string;
    title: string;
  }

  type ImageListType = ImageType[];

  const images: ImageListType = [
    {
      url: 'https://placehold.it/50x50',
      title: 'imaasdqwerfrefgoirehgoirhoige-MIP.png',
    },
    { url: 'https://placehold.it/50x50', title: 'image1-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image2-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image3-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image4-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image5-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image6-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image7-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image8-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'image9-MIP.png' },
    { url: 'https://placehold.it/50x50', title: 'imasdasdsage-MIP.png' },
  ];

  return (
    <Container>
      <ImageList cols={1} gap={20} sx={{ padding: 1 }}>
        {images.map((image) => (
          <Fragment key={image.title}>
            <ImageListItem sx={{ border: 1 }}>
              <img src={image.url} loading="lazy" />
              <ImageListItemBar
                sx={{
                  maxHeight: 50,
                  minHeight: 50,
                }}
                title={image.title}
              />
            </ImageListItem>
          </Fragment>
        ))}
      </ImageList>
    </Container>
  );
}
