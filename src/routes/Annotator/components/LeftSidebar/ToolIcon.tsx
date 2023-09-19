import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

export default function ToolIcon(props: {
  toolName: string;
  iconComponent: ReactNode;
  onClick?: () => void;
}) {
  // Box, brush, eraser, sam
  return (
    <Tooltip title={props.toolName} placement="right">
      <IconButton key={props.toolName} onClick={props.onClick}>
        {props.iconComponent}
      </IconButton>
    </Tooltip>
  );
}
