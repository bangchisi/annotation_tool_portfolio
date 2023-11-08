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
  [Tool.Select]: 'pointer',
  [Tool.Box]: 'crosshair',
  [Tool.Brush]: 'none',
  [Tool.Eraser]: 'default',
  [Tool.SAM]: 'crosshair',
};

// export const Editor = styled('canvas')<EditorProps>(() => {
export const Editor = styled('canvas')<EditorProps>(({ selectedTool }) => {
  return {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(215, 215, 215, 1.0)',
    // backgroundColor: 'white',
    cursor: CursorTypes[selectedTool] ?? 'default',
  };
});
