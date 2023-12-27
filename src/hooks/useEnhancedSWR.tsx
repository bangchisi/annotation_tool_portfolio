import axios from 'axios';
import useSWR from 'swr';

const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

export const useEnhancedSWR = <R,>(
  method: 'get' | 'post' | 'GET' | 'POST',
  endpoint: string,
  body?: object,
) => {
  const fetcher = async () => {
    const response = await axios<R>({
      url: `${API_URL}${endpoint}`,
      method,
      data: body,
    });

    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<R>(endpoint, fetcher);

  return { data, isError: error, isLoading, mutate };
};

export default useEnhancedSWR;
