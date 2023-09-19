import { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import { AuthButton, AuthTabs, Container } from './AuthForm.style';

export default function AuthForm() {
  const [mode, setMode] = useState<string>('login');

  return (
    <Container>
      <AuthTabs>
        <AuthButton onClick={() => setMode('login')}>Login</AuthButton>
        <AuthButton onClick={() => setMode('register')}>Register</AuthButton>
      </AuthTabs>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </Container>
  );
}
