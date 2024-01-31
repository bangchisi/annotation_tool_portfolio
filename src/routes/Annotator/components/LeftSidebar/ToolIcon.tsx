import { IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { ReactNode, useMemo } from 'react';
import { setTool } from 'routes/Annotator/slices/annotatorSlice';
import { Tool } from 'types';

// 툴 아이콘 컴포넌트
export default function ToolIcon(props: {
  toolName: string; // 툴 이름
  toolId: Tool; // 툴 아이디
  iconComponent: ReactNode; // 툴 아이콘
  // 툴팁 위치
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
  isFunction?: boolean; // 기능 버튼인지 여부. 사용하지 않음. 추후 삭제 요망.
}) {
  const selectedTool = useAppSelector((state) => state.annotator.selectedTool); // redux, 현재 선택된 툴
  const currentAnnotation = useAppSelector(
    (state) => state.annotator.currentAnnotation,
  ); // redux, 현재 어노테이션
  const dispatch = useAppDispatch(); // redux, dispatch

  const { toolName, toolId, placement, iconComponent } = props;

  // 툴 클릭 핸들러
  const handleClick = () => {
    dispatch(setTool(toolId));
  };

  // 툴 아이콘 색상. 현재 선택된 툴이면 파란색, 아니면 검정색
  const sx = useMemo(
    () => ({ color: selectedTool === toolId ? '#005AF0' : '#0e1116' }),
    [selectedTool, toolId],
  );

  return (
    // 툴팁
    <Tooltip title={toolName} placement={placement || 'right'}>
      <span>
        {/* 아이콘 버튼 */}
        <IconButton
          disabled={!currentAnnotation && toolId !== Tool.Select}
          key={props.toolName}
          onClick={handleClick}
          sx={sx}
        >
          {/* 아이콘 */}
          {iconComponent}
        </IconButton>
      </span>
    </Tooltip>
  );
}
