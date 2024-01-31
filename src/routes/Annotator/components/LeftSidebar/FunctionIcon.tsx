import { IconButton, Tooltip } from '@mui/material';
import { ReactNode } from 'react';
import { Tool } from 'types';

// 기능 버튼 컴포넌트. ex) 저장, redo, etc.
export default function FunctionIcon(props: {
  functionName: string; // 기능 이름
  functionId?: Tool; // 기능 아이디
  handleClick: () => void; // 기능 클릭 핸들러
  iconComponent: ReactNode; // 기능 아이콘
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
  isFunction?: boolean; // 기능 버튼인지 여부. 툴과 기능 버튼을 분리했기 떄문에 사용하지 않음. 추후 삭제 요망.
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
