import { useState } from "react";
import axios, { AxiosResponse , AxiosRequestConfig } from "axios";

type PostResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  postData: (body: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | null>;
};

const usePost = <T>(url: string): PostResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (body: any, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<T>(url, body, config);
      setData(response.data);
      return response;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };
// tôi muốn trả về postData để có thể gọi hàm này từ component khác
  return { data, loading, error, postData };
};

export default usePost;
