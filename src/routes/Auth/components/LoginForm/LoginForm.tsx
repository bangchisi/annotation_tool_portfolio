import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, InputField, LoginButton } from './LoginForm.style';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { AxiosError } from 'axios';
import { useAppDispatch } from 'App.hooks';
import {
  setIsAuthenticated,
  setPreference,
  setUser,
} from 'routes/Auth/slices/authSlice';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useCookies } from 'react-cookie';
import { Typography } from '@mui/material';
import { useTypedSWRMutation } from 'hooks';
import { userType } from 'types';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false); // 로그인 중인지 여부
  const [userId, setUserId] = useState(''); // 입력된 아이디
  const [password, setPassword] = useState(''); // 입력된 비밀번호
  const dispatch = useAppDispatch(); // redux dispatch

  const navigate = useNavigate(); // react-router-dom의 navigate hook

  // useTypedSWRMutation을 사용하여 로그인 mutation을 정의
  const { trigger: login } = useTypedSWRMutation<userType>(
    {
      method: 'post',
      endpoint: '/user/login',
    },
    {
      user_id: userId,
      password,
    },
  );

  // react-router-dom의 navigate hook을 사용해 path로 이동
  const routeChange = (path: string) => {
    navigate(path);
  };

  // 아이디와 비밀번호를 입력받는 input의 onChange 이벤트 핸들러
  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUserId(event?.target?.value);
  };
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event?.target?.value);
  };

  // react-cookie의 useCookies hook을 사용하여 쿠키를 설정
  // 값으로 userId를 넣고, path는 '/'로 설정(기본값)
  const [cookies, setCookie] = useCookies(['userId']);

  // 로그인 버튼을 눌렀을 때 실행되는 함수
  const onLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 기본 동작을 막음
    event.preventDefault();

    // validation. 아이디와 비밀번호가 입력되지 않았을 경우 alert를 띄우고 함수 종료
    if (userId === '' || password === '') {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 로그인 중이라는 것을 표시하기 위해 isLoading을 true로 설정
      setIsLoading(true);

      // 로그인 mutation을 실행
      const response = await login();

      // 로그인에 성공했을 경우
      if (response.userId) {
        setCookie('userId', response.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60,
        });

        // 로그인 여부를 redux에 넣음
        dispatch(setIsAuthenticated(response.isOnline));
        // user 정보를 redux에 넣음
        dispatch(
          setUser({
            userId: response.userId,
            userName: response.userName,
            isOnline: response.isOnline,
          }),
        );
        // preference 정보를 redux에 넣음
        dispatch(setPreference(response.preference));
        // datasets 페이지로 이동
        routeChange('/datasets');
      } else {
        // 로그인에 실패했을 경우 로그인 여부를 false로 설정
        dispatch(setIsAuthenticated(false));
      }
    } catch (error) {
      axiosErrorHandler(error, 'Failed to login');
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        alert(
          '유저 정보를 찾을 수 없습니다.\n아이디와 비밀번호를 확인해주세요.',
        );
        return;
      }
      alert(
        '알 수 없는 에러로 로그인이 불가능합니다. 담당자에게 연략 바랍니다.',
      );
    } finally {
      // 로그인이 끝났으므로 isLoading을 false로 설정
      setIsLoading(false);
    }
  };

  // 아이디와 비밀번호를 입력받는 input과 로그인 버튼을 렌더링
  return (
    <FormContainer>
      {/* 아이디 입력란 */}
      <Typography variant="subtitle1">ID</Typography>
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
        value={password}
        onChange={handlePasswordChange}
        type="password"
        placeholder="Password"
        size="small"
      />
      {/* 로그인 버튼 */}
      <LoginButton onClick={onLogin} type="submit">
        LOGIN
      </LoginButton>
      {/* 로그인 중이라면 로딩 스피너를 렌더링 */}
      {isLoading && (
        <LoadingSpinner message="로그인 중입니다. 잠시만 기다려주세요." />
      )}
    </FormContainer>
  );
}
