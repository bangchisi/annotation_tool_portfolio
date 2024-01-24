import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Divider, Menu, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import { Container, MenuButton } from './DatasetMenu.style';

// DatasetMenu 컴포넌트 props 타입
interface DatasetMenuProps {
  deleteDataset: (userId: string, datasetId: number) => Promise<void>; // Dataset 삭제 함수
  userId: string; // 로그인한 사용자 ID
  datasetId: number; // Dataset 고유 ID
  setExportId: React.Dispatch<React.SetStateAction<number | undefined>>; // 내보내기를 위한 Dataset id 업데이트 함수
  handleOpen: () => void; // 내보내기 모달 활성화 함수
}

// DatasetMenu 컴포넌트
export default function DatasetMenu(props: DatasetMenuProps) {
  const { deleteDataset, userId, datasetId, setExportId, handleOpen } = props; // props 디스트럭처링
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 메뉴 출력 엘리먼트
  const open = Boolean(anchorEl); // 메뉴 열림 여부

  // 메뉴 버튼 클릭 이벤트
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // 메뉴 출력 엘리먼트 설정
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 이벤트
  const onClose = () => {
    // 메뉴 출력 엘리먼트 초기화
    setAnchorEl(null);
  };

  // Dataset 삭제 이벤트
  const onDeleteClick = useCallback(() => {
    setAnchorEl(null);
    deleteDataset(userId, datasetId);
  }, [setAnchorEl, deleteDataset, userId, datasetId]);

  // 렌더링
  return (
    <Container>
      {/* 메뉴 열기 버튼 */}
      <MenuButton variant="text" size="small" onClick={onClick}>
        <MoreHorizIcon />
      </MenuButton>
      {/* 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        disableScrollLock={true}
      >
        {/* 내보내기 버튼 */}
        <MenuItem onClick={onClose}>
          <Button
            onClick={() => {
              setExportId(datasetId);
              handleOpen();
            }}
          >
            Export Dataset
          </Button>
        </MenuItem>
        <Divider />
        {/* 삭제 버튼 */}
        <MenuItem onClick={onDeleteClick}>
          <Button variant="text" color="warning" size="small">
            Delete
          </Button>
        </MenuItem>
      </Menu>
    </Container>
  );
}
