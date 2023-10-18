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
import FunctionIcon from './FunctionIcon';

/** 기능
 * 툴을 선택해서 <Annotator />의 state인 selectedTool을 변경
 * selectedTool에 따라 paper.view에 적용할 마우스 이벤트가 달라진다
 */

/** props
 * onChangeTool(tool: Tool): void
 */

// interface LeftSidebarProps {
//   onChangeTool: (tool: Tool) => void;
// }

export default function LeftSidebar() {
  return (
    <Container id="annotator-left-sidebar">
      <Toolbar />
      <Box sx={{ pl: 0.5 }}>
        <List>
          <ToolIcon
            toolName="Select"
            toolId={Tool.Select}
            iconComponent={<BackHandOutlinedIcon />}
          />
          <ToolIcon
            toolName="Box"
            toolId={Tool.Box}
            iconComponent={<RectangleOutlinedIcon />}
          />
          <ToolIcon
            toolName="Brush"
            toolId={Tool.Brush}
            iconComponent={<BrushOutlinedIcon />}
          />
          <ToolIcon
            toolName="Eraser"
            toolId={Tool.Eraser}
            iconComponent={<AutoFixOffOutlinedIcon />}
          />
          <ToolIcon
            toolName="SAM"
            toolId={Tool.SAM}
            iconComponent={<FacebookOutlinedIcon />}
          />
        </List>
        <Divider />
        <List>
          <FunctionIcon
            functionName="Save"
            iconComponent={<SaveIcon />}
            handleClick={() => console.log('save button')}
            isFunction={true}
          />
        </List>
      </Box>
    </Container>
  );
}
