import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useState } from 'react';

export default function Annotator() {
  enum tools {
    SELECT,
    POLYGON,
    BOX,
    BRUSH,
    ERASER,
    SAM,
  }

  const [currentTool, setCurrentTool] = useState<tools>(tools.SELECT);

  const handleCurrentToolChange = (tool: tools): void => {
    setCurrentTool(tool);
  };

  return (
    <Container>
      <LeftSidebar />
      <Workbench />
      <RightSidebar />
    </Container>
  );
}
