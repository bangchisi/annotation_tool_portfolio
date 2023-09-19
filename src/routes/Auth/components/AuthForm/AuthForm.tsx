import { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import { AuthButton, AuthTabs, Container } from './AuthForm.style';

export default function AuthForm() {
  enum mode {
    LOGIN,
    REGISTER,
  }

  const [currentMode, setCurrentMode] = useState<mode>(mode.LOGIN);

  return (
    <Container>
      <AuthTabs>
        <AuthButton onClick={() => setCurrentMode(mode.LOGIN)}>
          Login
        </AuthButton>
        <AuthButton onClick={() => setCurrentMode(mode.REGISTER)}>
          Register
        </AuthButton>
      </AuthTabs>
      {currentMode === mode.LOGIN && <LoginForm />}
      {currentMode === mode.REGISTER && <RegisterForm />}
    </Container>
  );
}
