// temp
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from './LoginForm.style';
import AuthModel from 'routes/Auth/models/Auth.model';
import { axiosErrorHandler } from 'helpers/Axioshelpers';
import { AxiosError } from 'axios';
import { useAppDispatch } from 'App.hooks';
import { setIsAuthenticated, setUser } from 'routes/Auth/slices/authSlice';
// temp end

export default function LoginForm() {
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
      const response = await AuthModel.login(userId, password);
      console.log('onLogin, response: ');
      console.dir(response);
      if (response.status === 200) {
        dispatch(setIsAuthenticated(response.data.is_online));
        // user 정보를 redux에 넣음
        dispatch(
          setUser({
            userId: response.data.user_id,
            username: response.data.username,
            isOnline: response.data.is_online,
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
    }
  };

  return (
    <FormContainer>
      <div className="mb-3">
        <label htmlFor="userId" className="form-label">
          ID
        </label>
        <input
          id="userId"
          className="form-control form-control-lg"
          name="userId"
          type="text"
          value={userId}
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
          type="password"
          value={password}
          placeholder="password"
          onChange={handlePasswordChange}
        />
        <button className="btn btn-primary" onClick={onLogin} type="submit">
          Login
        </button>
      </div>
    </FormContainer>
  );
}
