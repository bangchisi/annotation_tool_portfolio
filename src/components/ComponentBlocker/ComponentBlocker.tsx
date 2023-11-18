import { Blocker, Container, Message } from './ComponentBlocker.style';

export default function ComponentBlocker(props: { message: string }) {
  const { message } = props;

  return (
    <Container>
      {message !== '' && (
        <Blocker>
          <Message variant="body2">{message}</Message>
        </Blocker>
      )}
    </Container>
  );
}
