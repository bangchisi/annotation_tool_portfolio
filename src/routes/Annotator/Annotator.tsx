import { useEffect } from 'react';

import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';

export default function Annotator() {
  const img = new Image();
  img.src = 'https://placehold.it/550x550';
  // const $canvas = document.createElement('canvas');

  useEffect(() => {
    console.log('Annotator, useEffect');
    return () => {
      console.log('Annotator, useEffect, clean up');
    };
  }, []);

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}
