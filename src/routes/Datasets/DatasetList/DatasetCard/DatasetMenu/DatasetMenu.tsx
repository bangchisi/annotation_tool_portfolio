import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { Container } from './DatasetMenu.style';
import { useState } from 'react';

interface DatasetMenuProps {
  deleteDataset: (userId: string, datasetId: number) => Promise<void>;
  userId: string;
  datasetId: number;
}

export default function DatasetMenu(props: DatasetMenuProps) {
  const { deleteDataset, userId, datasetId } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Button variant="text" size="small" onClick={onClick}>
        <Typography variant="h6">...</Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem onClick={onClose}>
          <Button
            variant="text"
            color="warning"
            size="small"
            onClick={() => deleteDataset(userId, datasetId)}
          >
            Delete
          </Button>
        </MenuItem>
      </Menu>
    </Container>
  );
}
