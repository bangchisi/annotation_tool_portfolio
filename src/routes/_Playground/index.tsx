import { styled } from '@mui/material';
import { ProgressBar } from 'components';

const Container = styled('div')`
  background-color: rgba(0, 0, 0, 0.15);
  width: 100vw;
  height: 100vh;
`;

const Playground = () => {
  return (
    <Container>
      <ProgressBar text="완료" vertical progress={85} width={40} height={200} />
    </Container>
  );
};

export default Playground;
