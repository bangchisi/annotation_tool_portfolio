import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

export default function ToolIcon(props: {
  toolName: string;
  iconComponent: ReactNode;
}) {
  // Box, brush, eraser, sam
  return (
    <Tooltip title={props.toolName} placement="right">
      <IconButton key={props.toolName}>{props.iconComponent}</IconButton>
    </Tooltip>
  );
}
