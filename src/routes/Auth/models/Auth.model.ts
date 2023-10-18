import axios from 'axios';

const DEV_URL = 'http://143.248.249.11:60133';
const SERVER_URL = `${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const AuthModel = {
  // 회원가입
  register: (userId: string, password: string, username: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/user/register`
        : `${SERVER_URL}/user/resgister`;

    return axios.post(url, {
      user_id: userId,
      password: password,
      username: username,
    });
  },
  // 로그인
  login: (userId: string, password: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/user/login`
        : `${SERVER_URL}/user/login`;

    return axios.post(url, {
      user_id: userId,
      password: password,
    });
  },
};

export default AuthModel;
