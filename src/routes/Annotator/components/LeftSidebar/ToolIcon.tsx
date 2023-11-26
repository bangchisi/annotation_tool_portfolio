import { IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { ReactNode, useMemo } from 'react';
import { Tool } from 'routes/Annotator/Annotator';
import { setTool } from 'routes/Annotator/slices/annotatorSlice';

export default function ToolIcon(props: {
  toolName: string;
  toolId: Tool;
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
  const selectedTool = useAppSelector((state) => state.annotator.selectedTool);
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  );
  const dispatch = useAppDispatch();

  // Box, brush, eraser, sam
  const { toolName, toolId, placement, iconComponent } = props;

  const handleClick = () => {
    dispatch(setTool(toolId));
  };

  const sx = useMemo(
    () => ({ color: selectedTool === toolId ? '#005AF0' : '#0e1116' }),
    [selectedTool, toolId],
  );

  return (
    <Tooltip title={toolName} placement={placement || 'right'}>
      <span>
        <IconButton
          disabled={!currentAnnotation && toolId !== Tool.Select}
          key={props.toolName}
          onClick={handleClick}
          sx={sx}
        >
          {iconComponent}
        </IconButton>
      </span>
    </Tooltip>
  );
}
