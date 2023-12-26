import axios from 'axios';

export const axiosErrorHandler = (error: unknown, message: string) => {
  if (error instanceof Error) {
    console.log(message);
    console.dir(error.stack);
  }
};

export const enhancedAxios = <T extends object>(
  method: 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE',
  endpoint: string,
  body?: T,
) => {
  const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

  return axios({
    method,
    url: `${API_URL}${endpoint}`,
    data: body,
  });
};
