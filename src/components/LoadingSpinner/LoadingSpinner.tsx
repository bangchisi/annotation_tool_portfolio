import { Container, Spinner } from './LoadingSpinner.style';

interface LoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const { message } = props;
  return (
    <Container>
      <Spinner>{message}</Spinner>
    </Container>
  );
}
