import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, InputField, LoginButton } from './LoginForm.style';
import AuthModel from 'routes/Auth/models/Auth.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { AxiosError } from 'axios';
import { useAppDispatch } from 'App.hooks';
import { setIsAuthenticated, setUser } from 'routes/Auth/slices/authSlice';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { useCookies } from 'react-cookie';
import { Typography } from '@mui/material';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const routeChange = (path: string) => {
    navigate(path);
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUserId(event?.target?.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event?.target?.value);
  };

  const [cookies, setCookie] = useCookies(['userId']);

  const onLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    console.log('userId: ', userId, 'password: ', password);
    if (userId === '' || password === '') {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthModel.login(userId, password);
      console.log('onLogin, response: ');
      console.dir(response);
      if (response.status === 200) {
        setCookie('userId', response.data.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60,
        });
        console.dir(cookies.userId);
        dispatch(setIsAuthenticated(response.data.isOnline));
        // user 정보를 redux에 넣음
        dispatch(
          setUser({
            userId: response.data.userId,
            userName: response.data.userName,
            isOnline: response.data.isOnline,
          }),
        );
        routeChange('/datasets');
      } else {
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
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Typography variant="subtitle1">ID</Typography>
      <InputField
        name="userId"
        value={userId}
        onChange={handleUserIdChange}
        placeholder="ID"
      />
      <Typography variant="subtitle1">Password</Typography>
      <InputField
        name="password"
        value={password}
        onChange={handlePasswordChange}
        type="password"
        placeholder="Password"
      />
      <LoginButton onClick={onLogin} type="submit">
        LOGIN
      </LoginButton>
      {isLoading && (
        <LoadingSpinner message="로그인 중입니다. 잠시만 기다려주세요." />
      )}
    </FormContainer>
  );
}
