import { ChangeEvent, useState } from 'react';
import { FormContainer } from './RegisterForm.style';
import AuthModel from 'routes/Auth/models/Auth.model';
import { AxiosError } from 'axios';
import { axiosErrorHandler } from 'helpers/Axioshelpers';

export default function RegisterForm() {
  const [username, setUsername] = useState('admin');
  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [confirmPassword, setConfirmPassword] = useState('admin');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event?.target?.value);
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
      'username: ',
      username,
      'userId: ',
      userId,
      'password: ',
      password,
      'confirmPassword: ',
      confirmPassword,
    );

    // null check
    const isEmpty = [username, userId, password, confirmPassword].filter(
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

    if (username.length < 4 || userId.length < 4) {
      alert('유저이름과 ID는 최소 4글자로 입력해주세요.');
      return;
    }

    try {
      const response = await AuthModel.register(userId, password, username);
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
      console.dir(error);
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        alert('중복된 ID입니다. 다른 ID를 입력해주세요.');
        return;
      }
      alert(
        '알 수 없는 에러로 회원 등록이 불가능합니다. 담당자에게 연략 바랍니다.',
      );
    }
  };

  return (
    <FormContainer>
      <div className="mb-3">
        <label htmlFor="fullname" className="form-label">
          User Name (4글자 이상)
        </label>
        <input
          id="username"
          className="form-control form-control-lg"
          name="username"
          value={username}
          type="text"
          placeholder="User Name"
          onChange={handleUsernameChange}
        />
        <label htmlFor="username" className="form-label">
          ID (4글자 이상)
        </label>
        <input
          id="userId"
          className="form-control form-control-lg"
          name="userId"
          value={userId}
          type="text"
          placeholder="ID"
          onChange={handleUserIdChange}
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control form-control-lg"
          name="password"
          value={password}
          type="password"
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        <label htmlFor="confirm-password" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          className="form-control form-control-lg"
          name="confirm-password"
          value={confirmPassword}
          type="password"
          placeholder="Confirm Password"
          onChange={handleConfirmPasswordChange}
        />
        <button className="btn btn-primary" type="submit" onClick={onRegister}>
          Register
        </button>
      </div>
    </FormContainer>
  );
}
