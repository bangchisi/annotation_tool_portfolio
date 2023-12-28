import axios from 'axios';
import useSWR from 'swr';

const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const useTypedSWR = <R,>(
  method: 'get' | 'post' | 'delete' | 'put',
  endpoint: string,
  body?: object,
) => {
  const fetcher = async () => {
    const response = await axios<R>({
      url: `${API_URL}${endpoint}`,
      method,
      data: body,
    });

    return response.data as R;
  };

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  return { data, error, isLoading, mutate };
};

export default useTypedSWR;
