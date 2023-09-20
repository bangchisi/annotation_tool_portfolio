import { Toolbar, Box, List, Divider } from '@mui/material';
import ToolIcon from './ToolIcon';

import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import AutoFixOffOutlinedIcon from '@mui/icons-material/AutoFixOffOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { Container } from './LeftSidebar.style';

/** props
 * handleCurrentToolChange
 */

export default function LeftSidebar() {
  return (
    <Container id="annotator-left-sidebar">
      <Toolbar />
      <Box sx={{ pl: 0.5 }}>
        <List>
          <ToolIcon
            toolName="Select"
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon toolName="Polygon" iconComponent={<EditOutlinedIcon />} />
          <ToolIcon toolName="Box" iconComponent={<RectangleOutlinedIcon />} />
          <ToolIcon toolName="Brush" iconComponent={<BrushOutlinedIcon />} />
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
