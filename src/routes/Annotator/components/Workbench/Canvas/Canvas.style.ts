import { styled } from '@mui/material';
import { Tool } from 'routes/Annotator/Annotator';

interface EditorProps {
  selectedTool: Tool;
}

const CursorTypes = {
  [Tool.Select]: 'pointer',
  [Tool.Box]: 'crosshair',
  [Tool.Brush]: 'default',
  [Tool.Eraser]: 'default',
  [Tool.SAM]: 'crosshair',
};

export const Editor = styled('canvas')<EditorProps>(({ selectedTool }) => {
  return {
    width: '100%',
    height: 'auto',
    backgroundColor: 'white',
    cursor: CursorTypes[selectedTool] ?? 'default',
  };
});
