import type { ApiResponse } from "@/types/index";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

const apiPath = import.meta.env.VITE_API_PATH as string;

function token() {
  const cookieToken = Cookies.get("token");
  return cookieToken;
}

// 創建 axios 實例
const http = axios.create({
  baseURL: `${baseUrl}/api/${apiPath}`,
  headers: {
    Authorization: token(),
  },
});

http.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.includes("signin")) {
      config.baseURL = `${baseUrl}/admin`;
    } else if (config.url.includes("logout") || config.url.includes("check")) {
      config.baseURL = baseUrl;
    } else {
      config.baseURL = `${baseUrl}/api/${apiPath}`;
    }
  }
  return config;
});

// 錯誤處理攔截器
http.interceptors.response.use(
  (response) => response,
  (error) =>
    // 處理錯誤響應
    Promise.reject(error)
);

// 封裝 get 方法
export async function get<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return http.get<T>(path, config);
}

// 封裝 post 方法
export async function post<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return http.post<T>(path, data, config);
}

// 封裝 put 方法
export async function put<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return http.put<T>(path, data, config);
}

// 封裝 delete 方法
export async function del<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return http.delete<T>(path, config);
}

export function handleApiResponse<T>(response: ApiResponse<T>) {
  const result = {
    success: response.success,
    message: "",
    data: null,
  };
  // 檢查是否為 SimpleResponse
  if ("message" in response) {
    result.message = response.message as string;
  }

  // 檢查是否為 DataResponse
  if ("data" in response) {
    result.data = response.data;
  }

  // 處理可能的 DynamicKeyResponse
  if (response.success && !("data" in response) && !("message" in response)) {
    // 使用 Object.keys 遍歷並找到除已知屬性外的動態鍵
    const dynamicKeys = Object.keys(response).filter(
      (key) => key !== "success" && key !== "pagination" && key !== "messages"
    );
    for (const key of dynamicKeys) {
      const dynamicData = response[key as keyof typeof response];
      if (dynamicData) {
        result.data = dynamicData;
      }
    }
  }

  return result;
}
