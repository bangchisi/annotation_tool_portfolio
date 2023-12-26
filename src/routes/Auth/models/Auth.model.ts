import axios from 'axios';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;
// headers for CORS
const headers = {
  'Access-Control-Allow-Origin': SERVER_URL,
  'Access-Control-Allow-Credentials': 'true',
};

const AuthModel = {
  // 회원가입
  register: (userId: string, password: string, userName: string) => {
    const url = `${SERVER_URL}/user/register`;

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
    const url = `${SERVER_URL}/user/login`;

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
    const url = `${SERVER_URL}/user/logout`;

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
