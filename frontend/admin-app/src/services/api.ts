import axios from 'axios';
import { fileDb } from './fileDb';
import { localDb } from './localDb';

const envMode = import.meta.env.VITE_DATA_MODE;
const hasFileDb = typeof window !== 'undefined' && !!window.posApi;
const dataMode = envMode || (hasFileDb ? 'file' : 'local');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse<T> format
    if (response.data && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const wrap = <T>(data: T) => Promise.resolve({ data });

const localProductAPI = {
  getAll: () => wrap(localDb.products.list()),
  getById: (id: number) => wrap(localDb.products.list().find((item) => item.id === id)),
  create: (data: any) => wrap(localDb.products.create(data)),
  update: (id: number, data: any) => wrap(localDb.products.update(id, data)),
  delete: (id: number) => wrap(localDb.products.remove(id)),
};

const localCategoryAPI = {
  getAll: () => wrap(localDb.categories.list()),
  create: (data: any) => wrap(localDb.categories.create(data)),
  update: (id: number, data: any) => wrap(localDb.categories.update(id, data)),
  delete: (id: number) => wrap(localDb.categories.remove(id)),
};

const localOrderAPI = {
  getAll: () => wrap(localDb.orders.list()),
  getById: (id: number) => wrap(localDb.orders.list().find((item) => item.id === id)),
  create: (data: any) => wrap(localDb.orders.create(data)),
  updateStatus: (id: number, status: string) => wrap(localDb.orders.updateStatus(id, status as any)),
};

const localStatisticsAPI = {
  getToday: () => wrap(localDb.statistics.getToday()),
  getRevenue: (days: number = 7) => wrap(localDb.statistics.getRevenue(days)),
  getTopProducts: (limit: number = 5) => wrap(localDb.statistics.getTopProducts(limit)),
};

const fileProductAPI = {
  getAll: () => fileDb.products.list(),
  getById: (id: number) => fileDb.products.getById(id),
  create: (data: any) => fileDb.products.create(data),
  update: (id: number, data: any) => fileDb.products.update(id, data),
  delete: (id: number) => fileDb.products.delete(id),
};

const fileCategoryAPI = {
  getAll: () => fileDb.categories.list(),
  create: (data: any) => fileDb.categories.create(data),
  update: (id: number, data: any) => fileDb.categories.update(id, data),
  delete: (id: number) => fileDb.categories.delete(id),
};

const fileOrderAPI = {
  getAll: () => fileDb.orders.list(),
  getById: (id: number) => fileDb.orders.getById(id),
  create: (data: any) => fileDb.orders.create(data),
  updateStatus: (id: number, status: string) => fileDb.orders.updateStatus(id, status as any),
};

const fileStatisticsAPI = {
  getToday: () => fileDb.statistics.getToday(),
  getRevenue: (days: number = 7) => fileDb.statistics.getRevenue(days),
  getTopProducts: (limit: number = 5) => fileDb.statistics.getTopProducts(limit),
};

const useFile = dataMode === 'file' && hasFileDb;

export default api;

// API Services
export const productAPI = {
  getAll: () =>
    dataMode === 'remote'
      ? api.get('/menu/products')
      : useFile
        ? fileProductAPI.getAll()
        : localProductAPI.getAll(),
  getById: (id: number) =>
    dataMode === 'remote'
      ? api.get(`/menu/products/${id}`)
      : useFile
        ? fileProductAPI.getById(id)
        : localProductAPI.getById(id),
  create: (data: any) =>
    dataMode === 'remote'
      ? api.post('/admin/products', data)
      : useFile
        ? fileProductAPI.create(data)
        : localProductAPI.create(data),
  update: (id: number, data: any) =>
    dataMode === 'remote'
      ? api.put(`/admin/products/${id}`, data)
      : useFile
        ? fileProductAPI.update(id, data)
        : localProductAPI.update(id, data),
  delete: (id: number) =>
    dataMode === 'remote'
      ? api.delete(`/admin/products/${id}`)
      : useFile
        ? fileProductAPI.delete(id)
        : localProductAPI.delete(id),
};

export const categoryAPI = {
  getAll: () =>
    dataMode === 'remote'
      ? api.get('/menu/categories')
      : useFile
        ? fileCategoryAPI.getAll()
        : localCategoryAPI.getAll(),
  create: (data: any) =>
    dataMode === 'remote'
      ? api.post('/admin/categories', data)
      : useFile
        ? fileCategoryAPI.create(data)
        : localCategoryAPI.create(data),
  update: (id: number, data: any) =>
    dataMode === 'remote'
      ? api.put(`/admin/categories/${id}`, data)
      : useFile
        ? fileCategoryAPI.update(id, data)
        : localCategoryAPI.update(id, data),
  delete: (id: number) =>
    dataMode === 'remote'
      ? api.delete(`/admin/categories/${id}`)
      : useFile
        ? fileCategoryAPI.delete(id)
        : localCategoryAPI.delete(id),
};

export const orderAPI = {
  getAll: (params?: any) =>
    dataMode === 'remote'
      ? api.get('/admin/orders', { params })
      : useFile
        ? fileOrderAPI.getAll()
        : localOrderAPI.getAll(),
  getById: (id: number) =>
    dataMode === 'remote'
      ? api.get(`/admin/orders/${id}`)
      : useFile
        ? fileOrderAPI.getById(id)
        : localOrderAPI.getById(id),
  create: (data: any) =>
    dataMode === 'remote'
      ? api.post('/orders/checkout', data)
      : useFile
        ? fileOrderAPI.create(data)
        : localOrderAPI.create(data),
  updateStatus: (id: number, status: string) =>
    dataMode === 'remote'
      ? api.put(`/admin/orders/${id}/status`, { status })
      : useFile
        ? fileOrderAPI.updateStatus(id, status)
        : localOrderAPI.updateStatus(id, status),
};

export const statisticsAPI = {
  getToday: () =>
    dataMode === 'remote'
      ? api.get('/admin/statistics/today')
      : useFile
        ? fileStatisticsAPI.getToday()
        : localStatisticsAPI.getToday(),
  getRevenue: (days: number = 7) =>
    dataMode === 'remote'
      ? api.get(`/admin/statistics/revenue?days=${days}`)
      : useFile
        ? fileStatisticsAPI.getRevenue(days)
        : localStatisticsAPI.getRevenue(days),
  getTopProducts: (limit: number = 5) =>
    dataMode === 'remote'
      ? api.get(`/admin/statistics/top-products?limit=${limit}`)
      : useFile
        ? fileStatisticsAPI.getTopProducts(limit)
        : localStatisticsAPI.getTopProducts(limit),
};
