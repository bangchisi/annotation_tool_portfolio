import { Toolbar, Box, List, Divider } from '@mui/material';
import ToolIcon from './ToolIcon';

import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Container } from './LeftSidebar.style';
import { Tool } from 'routes/Annotator/Annotator';

interface LeftSidebarProps {
  onChangeTool: (tool: Tool) => void;
}

export default function LeftSidebar(props: LeftSidebarProps) {
  const { onChangeTool } = props;

  return (
    <Container id="annotator-left-sidebar">
      <Toolbar />
      <Box sx={{ pl: 0.5 }}>
        <List>
          <ToolIcon
            toolName="Select"
            iconComponent={<BackHandOutlinedIcon />}
            onClick={() => onChangeTool(Tool.Select)}
          />
          <ToolIcon toolName="Box" iconComponent={<RectangleOutlinedIcon />} />
          <ToolIcon
            toolName="Brush"
            iconComponent={<BrushOutlinedIcon />}
            onClick={() => onChangeTool(Tool.Brush)}
          />
          <ToolIcon
            toolName="Eraser"
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon toolName="SAM" iconComponent={<FacebookOutlinedIcon />} />
        </List>
        <Divider />
        <List>
          <ToolIcon toolName="Save" iconComponent={<SaveIcon />} />
        </List>
      </Box>
    </Container>
  );
}
