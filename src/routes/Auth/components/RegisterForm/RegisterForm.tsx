import { ChangeEvent, useState } from 'react';
import {
  FormContainer,
  InputField,
  RegisterButton,
} from './RegisterForm.style';
import AuthModel from 'routes/Auth/models/Auth.model';
import { AxiosError } from 'axios';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { Typography } from '@mui/material';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUserName(event?.target?.value);
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUserId(event?.target?.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event?.target?.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setConfirmPassword(event?.target?.value);
  };

  const onRegister = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    console.log(
      'userName: ',
      userName,
      'userId: ',
      userId,
      'password: ',
      password,
      'confirmPassword: ',
      confirmPassword,
    );

    // null check
    const isEmpty = [userName, userId, password, confirmPassword].filter(
      (e) => e === '',
    ).length;

    if (isEmpty > 0) {
      alert('필요한 모든 항목을 입력 해주세요.');
      return;
    }

    // 비밀번호, 확인 일치
    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (userName.length < 4 || userId.length < 4) {
      alert('유저이름과 ID는 최소 4글자로 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthModel.register(userId, password, userName);
      console.log('onRegister, response: ');
      console.log('response.status: ', response.status);
      console.dir(response);
      if (response.status === 200) {
        alert('회원등록 성공');
        window.location.reload();
      } else {
        alert('회원등록 실패');
      }
    } catch (error) {
      axiosErrorHandler(error, 'Failed to register');
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        alert('중복된 ID입니다. 다른 ID를 입력해주세요.');
        return;
      }
      alert(
        '알 수 없는 에러로 회원 등록이 불가능합니다. 담당자에게 연략 바랍니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Typography variant="subtitle1">User Name (4글자 이상)</Typography>
      <InputField
        name="username"
        value={userName}
        onChange={handleUserNameChange}
        placeholder="User Name"
      />
      <Typography variant="subtitle1">ID (4글자 이상)</Typography>
      <InputField
        name="userId"
        value={userId}
        onChange={handleUserIdChange}
        placeholder="ID"
      />
      <Typography variant="subtitle1">Password</Typography>
      <InputField
        name="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <Typography variant="subtitle1">Confirm Password</Typography>
      <InputField
        name="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="Confirm Password"
      />
      <RegisterButton onClick={onRegister} type="submit">
        REGISTER
      </RegisterButton>
      {isLoading && (
        <LoadingSpinner message="회원가입 진행중입니다. 잠시만 기다려주세요." />
      )}
    </FormContainer>
  );
}
