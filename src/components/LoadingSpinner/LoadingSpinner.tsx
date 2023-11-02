import { Container, Message, Progress, Spinner } from './LoadingSpinner.style';

interface LoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const { message } = props;
  return (
    <Container>
      <Spinner>
        <Progress />
        <Message variant="body2">{message}</Message>
      </Spinner>
    </Container>
  );
}
