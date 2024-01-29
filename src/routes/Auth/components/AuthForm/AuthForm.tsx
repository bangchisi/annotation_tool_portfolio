import { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import { AuthButton, AuthTabs, Container } from './AuthForm.style';

// 어느 탭이 선택되었는지 알려주는 enum
export enum mode {
  LOGIN,
  REGISTER,
}

export default function AuthForm() {
  // 현재 선택된 탭을 저장하는 state
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
      {/* 현재 선택된 탭에 따라 다른 컴포넌트를 렌더링합니다. */}
      {currentMode === mode.LOGIN && <LoginForm />}
      {currentMode === mode.REGISTER && (
        <RegisterForm setCurrentMode={setCurrentMode} />
      )}
    </Container>
  );
}
