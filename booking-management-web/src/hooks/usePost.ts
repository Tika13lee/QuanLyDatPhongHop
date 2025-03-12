import { useState } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

type PostResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  postData: (body: any, config?: AxiosRequestConfig, method?: "POST" | "PUT") => Promise<AxiosResponse<T> | null>;
};

const usePost = <T>(url: string): PostResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (body: any, config?: AxiosRequestConfig, method: "POST" | "PUT" = "POST") => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: method,
        url: url,
        data: body,
        ...config,
      });
      setData(response.data);
      return response;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePost;
