import axios from 'axios';

const DEV_URL = `http://${process.env.REACT_APP_DEV_IP}:${process.env.REACT_APP_DEV_PORT}`;
const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const baseURL = process.env.NODE_ENV === 'development' ? DEV_URL : SERVER_URL;
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
