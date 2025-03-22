import { useEffect, useState } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

type PostResult<T> = {
  data: T | null;
  loading: boolean;
  error: any;
  postData: (
    body: any,
    config?: AxiosRequestConfig,
    method?: "POST" | "PUT"
  ) => Promise<AxiosResponse<T> | null>;
};

const usePost = <T>(url: string): PostResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const postData = async (
    body: any,
    config?: AxiosRequestConfig,
    method: "POST" | "PUT" = "POST"
  ) => {
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
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data);
        setError(err.response?.data || "Có lỗi xảy ra, vui lòng thử lại!");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.log("Error updated:", error);
    }
  }, [error]);

  return { data, loading, error, postData };
};

export default usePost;
