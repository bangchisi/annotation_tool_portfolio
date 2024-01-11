import { ChangeEvent, useState } from 'react';
import {
  FormContainer,
  InputField,
  RegisterButton,
} from './RegisterForm.style';
import { AxiosError } from 'axios';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { Typography } from '@mui/material';
import { useTypedSWRMutation } from 'hooks';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false); // 회원가입 요청 중인지 여부
  const [userName, setUserName] = useState(''); // 입력된 유저이름
  const [userId, setUserId] = useState(''); // 입력된 아이디
  const [password, setPassword] = useState(''); // 입력된 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 입력된 비밀번호 확인

  // useTypedSWRMutation을 사용하여 회원가입 mutation을 정의
  const { trigger: register } = useTypedSWRMutation(
    {
      method: 'post',
      endpoint: '/user/register',
    },
    {
      user_id: userId,
      password,
      username: userName,
    },
  );

  // 유저이름, 아이디, 비밀번호, 비밀번호 확인을 입력받는 input의 onChange 이벤트 핸들러
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

  // 회원가입 버튼을 눌렀을 때 실행되는 함수
  const onRegister = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    // 필요한 모든 항목이 입력되었는지 확인
    const isEmpty = [userName, userId, password, confirmPassword].filter(
      (e) => e === '',
    ).length;

    // 필요한 모든 항목이 입력되지 않았다면 alert를 띄우고 함수 종료
    if (isEmpty > 0) {
      alert('필요한 모든 항목을 입력 해주세요.');
      return;
    }

    // 비밀번호, 비밀번호 확인 일치 여부 확인
    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    // 유저이름과 아이디의 길이가 4글자 이상인지 확인
    if (userName.length < 4 || userId.length < 4) {
      alert('유저이름과 ID는 최소 4글자로 입력해주세요.');
      return;
    }

    try {
      // 회원가입 중이라는 것을 표시하기 위해 isLoading을 true로 설정
      setIsLoading(true);

      // 회원가입 mutation을 실행
      await register();
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
      // 회원가입이 끝났으므로 isLoading을 false로 설정
      setIsLoading(false);
    }
  };

  // 회원가입을 위한 input들을 렌더링
  return (
    <FormContainer>
      {/* 유저이름 입력란 */}
      <Typography variant="subtitle1">User Name (4글자 이상)</Typography>
      <InputField
        name="username"
        value={userName}
        onChange={handleUserNameChange}
        placeholder="User Name"
        size="small"
      />
      {/* 아이디 입력란 */}
      <Typography variant="subtitle1">ID (4글자 이상)</Typography>
      <InputField
        name="userId"
        value={userId}
        onChange={handleUserIdChange}
        placeholder="ID"
        size="small"
      />
      {/* 비밀번호 입력란 */}
      <Typography variant="subtitle1">Password</Typography>
      <InputField
        name="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        size="small"
      />
      {/* 비밀번호 확인 입력란 */}
      <Typography variant="subtitle1">Confirm Password</Typography>
      <InputField
        name="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="Confirm Password"
        size="small"
      />
      {/* 회원가입 버튼 */}
      <RegisterButton onClick={onRegister} type="submit">
        REGISTER
      </RegisterButton>
      {/* 회원가입 중이라면 로딩 스피너를 렌더링 */}
      {isLoading && (
        <LoadingSpinner message="회원가입 진행중입니다. 잠시만 기다려주세요." />
      )}
    </FormContainer>
  );
}
