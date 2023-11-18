import { Blocker, Container, Message } from './ComponentBlocker.style';

export default function ComponentBlocker(props: { message: string }) {
  const { message } = props;

  return (
    <Container>
      {message !== '' && (
        <Blocker>
          <Message variant="body1" color="white">
            {message}
          </Message>
        </Blocker>
      )}
    </Container>
  );
}
