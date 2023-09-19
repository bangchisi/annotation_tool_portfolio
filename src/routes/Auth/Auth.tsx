import AuthForm from 'routes/Auth/components/AuthForm/AuthForm';
import { AuthTitle, Container } from './Auth.style';

export default function Auth() {
  return (
    <Container>
      <AuthTitle>
        <h1>Annotator</h1>
      </AuthTitle>
      <AuthForm />
    </Container>
  );
}
