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

export default function Annotator() {
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Select);

  return (
    <Container>
      <LeftSidebar onChangeTool={setSelectedTool} />
      <Workbench selectedTool={selectedTool} />
      <RightSidebar />
    </Container>
  );
}
