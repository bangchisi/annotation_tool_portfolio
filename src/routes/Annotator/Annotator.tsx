import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useState } from 'react';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

// 서버에서 받아와야 할 정보. category 목록, 각 category의 annotation 목록
// categories 안에 category가 있고 category 안에 annotations가 있음
// const initialCategories = ['human', 'animal', 'building', 'machine'].map(
//   (categoryName, index) => setCategory(index, categoryName, []),
// );

// const initialCategories = {
//   data: {
//     human: {
//       id: 1,
//       name: 'human',
//       annotations: [],
//     },
//     animal: {
//       id: 2,
//       name: 'animal',
//       annotations: [],
//     },
//     building: {
//       id: 3,
//       name: 'building',
//       annotations: [],
//     },
//     machine: {
//       id: 4,
//       name: 'machine',
//       annotations: [],
//     },
//   },
// };

export default function Annotator() {
  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}
