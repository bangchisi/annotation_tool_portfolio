import { Typography } from '@mui/material';
import { Container, ReloadButton } from './Reload.style';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

interface ReloadProps {
  setDatasetList: (userId: string) => Promise<void>;
  userId: string;
}

export default function Reload(props: ReloadProps) {
  const { setDatasetList, userId } = props;

  return (
    <Container>
      <Typography>Dataset을 불러올 수 없습니다. 다시 시도 해주세요.</Typography>
      <ReloadButton color="info" onClick={() => setDatasetList(userId)}>
        <CachedOutlinedIcon />
        reload
      </ReloadButton>
    </Container>
  );
}
