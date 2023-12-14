import { styled } from '@mui/material';

interface EditorProps {
  selectedTool: Tool;
}

enum Tool {
  Select,
  Box,
  Brush,
  Eraser,
  SAM,
}

const CursorTypes = {
  [Tool.Select]: 'grabbing',
  [Tool.Box]: 'crosshair',
  [Tool.Brush]: 'none',
  [Tool.Eraser]: 'none',
  [Tool.SAM]: 'crosshair',
};

export const Editor = styled('canvas')<EditorProps>(({ selectedTool }) => {
  return {
    backgroundColor: 'var(--editor-bg)',
    cursor: CursorTypes[selectedTool] ?? 'default',
  };
});
