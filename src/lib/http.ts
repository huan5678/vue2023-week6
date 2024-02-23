import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { ApiResponse } from '@/types/index';

const baseUrl = import.meta.env.VITE_BASE_URL as string || 'https://ec-course-api.hexschool.io/v2';  // github pages 爛東西

const apiPath = import.meta.env.VITE_API_PATH as string || 'synthwave'; // github pages 爛東西

function token() {
  const cookieToken = Cookies.get('token');
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
  const newConfig = { ...config };
  if (config.url) {
    if (config.url.includes('signin')) {
      newConfig.baseURL = `${baseUrl}/admin`;
    } else if (config.url.includes('logout') || config.url.includes('check')) {
      newConfig.baseURL = baseUrl;
    } else {
      newConfig.baseURL = `${baseUrl}/api/${apiPath}`;
    }
  }
  return newConfig;
});

// 錯誤處理攔截器
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// 封裝 get 方法
export async function get<T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return http.get<T>(path, config);
}

// 封裝 post 方法
export async function post<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return http.post<T>(path, data, config);
}

// 封裝 put 方法
export async function put<T>(
  path: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return http.put<T>(path, data, config);
}

// 封裝 delete 方法
export async function del<T>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return http.delete<T>(path, config);
}

export function handleApiResponse<T>(response: ApiResponse<T>) {
  const result = {
    success: response.success,
    message: '',
    data: null as T | null,
  };
  // 檢查是否為 SimpleResponse
  if ('message' in response) {
    result.message = response.message as string;
  }

  // 檢查是否為 DataResponse
  if (response.success && !('data' in response) && !('message' in response)) {
    const dynamicKeys = Object.keys(response).filter(
      (key) => key !== 'success' && key !== 'pagination' && key !== 'messages',
    );
    dynamicKeys.forEach((key) => {
      const dynamicData = response[key as keyof typeof response];
      if (dynamicData) {
        result.data = dynamicData as T | null;
      }
    });
  }

  return result;
}
