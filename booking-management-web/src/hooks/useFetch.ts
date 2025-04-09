import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  setData?: (data: T) => void;
};

const useFetch = <T>(
  url: string,
  options?: AxiosRequestConfig
): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!url) return;

      setLoading(true);

      try {
        // Set the token in the headers
        const token = localStorage.getItem("accessToken");
        const config: AxiosRequestConfig = {
          ...options,
          headers: {
            ...(options?.headers || {}),
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        const response = await axios.get<T>(url, config);
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error, setData };
};

export default useFetch;
