import axios from 'axios';

const SERVER_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

const baseURL = SERVER_URL;
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
