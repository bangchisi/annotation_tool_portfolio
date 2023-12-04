import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Divider, Menu, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import { Container, MenuButton } from './DatasetMenu.style';

interface DatasetMenuProps {
  deleteDataset: (userId: string, datasetId: number) => Promise<void>;
  userId: string;
  datasetId: number;
  setExportId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DatasetMenu(props: DatasetMenuProps) {
  const { deleteDataset, userId, datasetId, setExportId, setOpen } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onDeleteClick = useCallback(() => {
    setAnchorEl(null);
    deleteDataset(userId, datasetId);
  }, [setAnchorEl, deleteDataset, userId, datasetId]);

  return (
    <Container>
      <MenuButton variant="text" size="small" onClick={onClick}>
        <MoreHorizIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        disableScrollLock={true}
      >
        <MenuItem onClick={onClose}>
          <Button
            onClick={() => {
              setExportId(datasetId);
              setOpen(true);
            }}
          >
            Export Dataset
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onDeleteClick}>
          <Button variant="text" color="warning" size="small">
            Delete
          </Button>
        </MenuItem>
      </Menu>
    </Container>
  );
}
