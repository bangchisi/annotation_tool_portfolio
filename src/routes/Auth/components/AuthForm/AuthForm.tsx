import { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import { AuthButton, AuthTabs, Container } from './AuthForm.style';

export enum mode {
  LOGIN,
  REGISTER,
}

export default function AuthForm() {
  const [currentMode, setCurrentMode] = useState<mode>(mode.LOGIN);

  return (
    <Container>
      <AuthTabs>
        <AuthButton
          data-selected={currentMode === mode.LOGIN}
          onClick={() => setCurrentMode(mode.LOGIN)}
        >
          Login
        </AuthButton>
        <AuthButton
          data-selected={currentMode === mode.REGISTER}
          onClick={() => setCurrentMode(mode.REGISTER)}
        >
          Register
        </AuthButton>
      </AuthTabs>
      {currentMode === mode.LOGIN && <LoginForm />}
      {currentMode === mode.REGISTER && <RegisterForm />}
    </Container>
  );
}
