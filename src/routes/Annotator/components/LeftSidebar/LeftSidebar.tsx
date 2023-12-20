import { Box, Divider, List } from '@mui/material';
import ToolIcon from './ToolIcon';

import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Tool } from 'types';
import FunctionIcon from './FunctionIcon';
import { Container } from './LeftSidebar.style';
import useReloadAnnotator from 'routes/Annotator/hooks/useReloadAnnotator';

export default function LeftSidebar() {
  const { saveData } = useReloadAnnotator();

  return (
    <Container id="annotator-left-sidebar">
      <Box
        className="toolbar-step"
        sx={{
          pl: 0.5,
          paddingTop: 3,
        }}
      >
        <List>
          <ToolIcon
            toolName="Select (S)"
            toolId={Tool.Select}
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon
            toolName="Box (R)"
            toolId={Tool.Box}
            iconComponent={<RectangleOutlinedIcon />}
          />
          <ToolIcon
            toolName="Brush (B)"
            toolId={Tool.Brush}
            iconComponent={<BrushOutlinedIcon />}
          />
          <ToolIcon
            toolName="Eraser (E)"
            toolId={Tool.Eraser}
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon
            toolName="SAM (F)"
            toolId={Tool.SAM}
            iconComponent={<FacebookOutlinedIcon />}
          />
        </List>
        <Divider />
        <List>
          <FunctionIcon
            functionName="Save"
            iconComponent={<SaveIcon />}
            handleClick={saveData}
            isFunction={true}
          />
        </List>
      </Box>
    </Container>
  );
}
