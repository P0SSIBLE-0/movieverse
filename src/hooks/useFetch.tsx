import { useState, useEffect } from 'react';
import type { ApiErrorShape } from '../types';

type ApiResponse<T> = {
  data: T;
};

const useFetch = <T, Params extends unknown[]>(
  apiCallFunction: (...args: Params) => Promise<ApiResponse<T>>,
  ...params: Params
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stringify params to use as a dependency, ensuring stability if params are objects/arrays
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);

    const fetchData = async () => {
      try {
        const res = await apiCallFunction(...JSON.parse(paramsString));
        setData(res.data);
      } catch (err) {
        const apiError = err as ApiErrorShape;
        console.error('API Error in useFetch:', err);
        setError(
          apiError.response?.data?.status_message ||
            apiError.message ||
            'Something went wrong!'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCallFunction, paramsString]); // Re-run if function or stringified params change

  return { data, loading, error };
};

export default useFetch;
