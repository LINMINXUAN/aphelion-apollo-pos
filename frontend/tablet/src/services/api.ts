import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/api';
import { localDb } from './localDb';

// 建立 Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 自動附加 JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 解構 ApiResponse 並處理錯誤
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 直接回傳 data 欄位，簡化前端使用
    return response.data.data;
  },
  (error) => {
    // 處理 401 未授權：清除 Token 並跳轉登入頁
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }

    // 處理其他錯誤
    const errorMessage = error.response?.data?.message || '發生未知錯誤';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

const dataMode = import.meta.env.VITE_DATA_MODE || 'local';

interface ApiClient {
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, payload: unknown) => Promise<T>;
}

const localApi: ApiClient = {
  get: async <T>(path: string) => {
    switch (path) {
      case '/menu/products':
        return (await localDb.products.list()) as T;
      case '/menu/categories':
        return (await localDb.categories.list()) as T;
      default:
        throw new Error(`未知的本地 API 路徑: ${path}`);
    }
  },
  post: async <T>(path: string, payload: unknown) => {
    switch (path) {
      case '/orders/checkout':
        return (await localDb.orders.create(payload as any)) as T;
      default:
        throw new Error(`未知的本地 API 路徑: ${path}`);
    }
  },
};

const remoteApi: ApiClient = {
  get: <T>(path: string) => api.get(path) as unknown as Promise<T>,
  post: <T>(path: string, payload: unknown) => api.post(path, payload) as unknown as Promise<T>,
};

export default (dataMode === 'remote' ? remoteApi : localApi) as ApiClient;
