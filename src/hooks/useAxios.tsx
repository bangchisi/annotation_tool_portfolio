import axios from 'axios';
import useSWR from 'swr';

const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const useAxios = <T extends object>(
  method:
    | 'get'
    | 'delete'
    | 'post'
    | 'put'
    | 'GET'
    | 'DELETE'
    | 'POST'
    | 'PUT' = 'get',
  endpoint: string,
  body?: T,
) => {
  const fetcher = async (url: string) => {
    const response = await axios<T>({
      url: `${API_URL}${url}`,
      method,
      data: body,
    });

    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  return {
    data,
    isError: error,
    isLoading,
    mutate,
  };
};

export default useAxios;
