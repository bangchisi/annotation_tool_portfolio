import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

export default function ToolIcon(props: {
  toolName: string;
  iconComponent: ReactNode;
  onClick?: () => void;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
}) {
  // Box, brush, eraser, sam
  const { placement } = props;
  return (
    <Tooltip title={props.toolName} placement={placement || 'right'}>
      <IconButton key={props.toolName} onClick={props.onClick}>
        {props.iconComponent}
      </IconButton>
    </Tooltip>
  );
}
