import axios from 'axios';

// const DEV_URL = 'http://143.248.249.11:60133';
const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;
// headers for CORS
const headers = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'development' ? DEV_URL : SERVER_URL,
  'Access-Control-Allow-Credentials': 'true',
};

const AuthModel = {
  // 회원가입
  register: (userId: string, password: string, userName: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/user/register`
        : `${SERVER_URL}/user/resgister`;

    return axios.post(
      url,
      {
        user_id: userId,
        password: password,
        username: userName,
      },
      {
        headers,
      },
    );
  },
  // 로그인
  login: (userId: string, password: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/user/login`
        : `${SERVER_URL}/user/login`;

    return axios.post(
      url,
      {
        user_id: userId,
        password: password,
      },
      {
        headers,
      },
    );
  },
  // 로그아웃
  logout: (userId: string) => {
    const url =
      process.env.NODE_ENV === 'development'
        ? `${DEV_URL}/user/logout`
        : `${SERVER_URL}/user/logout`;

    return axios.post(
      url,
      {
        user_id: userId,
      },
      {
        headers,
      },
    );
  },
};

export default AuthModel;
