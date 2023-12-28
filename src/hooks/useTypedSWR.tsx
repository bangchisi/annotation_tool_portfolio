import axios from 'axios';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const API_URL = `http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}`;

type SWRArgsType = {
  method: 'get' | 'post' | 'delete' | 'put';
  endpoint: string;
  key?: string;
};

export const useTypedSWR = <R,>(args: SWRArgsType, body?: object) => {
  const { method, endpoint, key } = args;
  const fetcher = async () => {
    const response = await axios<R>({
      url: `${API_URL}${endpoint}`,
      method,
      data: body,
    });

    return response.data as R;
  };

  const { data, error, isLoading, mutate } = useSWR(key ?? endpoint, fetcher);

  return { data, error, isLoading, mutate };
};

export const useTypedSWRMutation = <R,>(args: SWRArgsType, body?: object) => {
  const { method, endpoint, key } = args;
  const fetcher = async () => {
    const response = await axios<R>({
      url: `${API_URL}${endpoint}`,
      method,
      data: body,
    });

    return response.data as R;
  };

  const { data, error, isMutating, trigger } = useSWRMutation(
    key ?? endpoint,
    fetcher,
  );

  return { data, error, isMutating, trigger };
};
