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

/** 기능
 * 툴을 선택해서 <Annotator />의 state인 selectedTool을 변경
 * selectedTool에 따라 paper.view에 적용할 마우스 이벤트가 달라진다
 */

/** props
 * onChangeTool(tool: Tool): void
 */

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
          <ToolIcon
            toolName="Box"
            iconComponent={<RectangleOutlinedIcon />}
            onClick={() => onChangeTool(Tool.Box)}
          />
          <ToolIcon
            toolName="Brush"
            iconComponent={<BrushOutlinedIcon />}
            onClick={() => onChangeTool(Tool.Brush)}
          />
          <ToolIcon
            toolName="Eraser"
            iconComponent={<AutoFixOffOutlinedIcon />}
            onClick={() => onChangeTool(Tool.Eraser)}
          />
          <ToolIcon
            toolName="SAM"
            iconComponent={<FacebookOutlinedIcon />}
            onClick={() => onChangeTool(Tool.SAM)}
          />
        </List>
        <Divider />
        <List>
          <ToolIcon toolName="Save" iconComponent={<SaveIcon />} />
        </List>
      </Box>
    </Container>
  );
}
