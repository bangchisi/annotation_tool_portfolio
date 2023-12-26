import axios from 'axios';
import useSWR from 'swr';

const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const useAxios = <T extends object>(
  method: 'get' | 'post' | 'GET' | 'POST' = 'get',
  endpoint: string,
  body?: T,
) => {
  const fetcher = async () => {
    const response = await axios<T>({
      url: `${API_URL}${endpoint}`,
      method,
      data: body,
    });

    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<T>(endpoint, fetcher);

  return { data, isError: error, isLoading, mutate };
};

export default useAxios;
