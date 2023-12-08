import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';
import { Tool } from 'types';

export default function FunctionIcon(props: {
  functionName: string;
  functionId?: Tool;
  handleClick: () => void;
  iconComponent: ReactNode;
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
  isFunction?: boolean;
}) {
  const { functionName, functionId, placement, handleClick } = props;

  return (
    <Tooltip title={functionName} placement={placement || 'right'}>
      <IconButton key={functionId} onClick={handleClick}>
        {props.iconComponent}
      </IconButton>
    </Tooltip>
  );
}
