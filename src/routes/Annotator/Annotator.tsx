import RightSidebar from './components/RightSidebar/RightSidebar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import { Container } from './Annotator.style';
import Workbench from './components/Workbench/Workbench';
import { useState } from 'react';
import { AnnotationType } from './Annotator.types';

export enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

const initialAnnotations: AnnotationType[] = [];

export default function Annotator() {
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.Select);
  const [annotations, setAnnotations] =
    useState<AnnotationType[]>(initialAnnotations);

  console.log('annotations: ');
  console.dir(annotations);
  return (
    <Container>
      <LeftSidebar onChangeTool={setSelectedTool} />
      <Workbench
        selectedTool={selectedTool}
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
      />
      <RightSidebar
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
      />
    </Container>
  );
}
