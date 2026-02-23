import type { Category, Order, PlaceOrderRequest, Product, RevenueData, Statistics, TopProduct } from '../types';

const getApi = () => {
  if (!window.posApi) {
    throw new Error('POS File DB not available');
  }
  return window.posApi;
};

const wrap = async <T>(promise: Promise<T>) => ({ data: await promise });

export const fileDb = {
  categories: {
    list: () => wrap(getApi().categories.list()),
    create: (data: Partial<Category>) => wrap(getApi().categories.create(data)),
    update: (id: number, data: Partial<Category>) => wrap(getApi().categories.update(id, data)),
    delete: (id: number) => wrap(getApi().categories.delete(id)),
  },
  products: {
    list: () => wrap(getApi().products.list()),
    getById: (id: number) => wrap(getApi().products.getById(id)),
    create: (data: Partial<Product>) => wrap(getApi().products.create(data)),
    update: (id: number, data: Partial<Product>) => wrap(getApi().products.update(id, data)),
    delete: (id: number) => wrap(getApi().products.delete(id)),
  },
  orders: {
    list: () => wrap(getApi().orders.list()),
    getById: (id: number) => wrap(getApi().orders.getById(id)),
    create: (data: PlaceOrderRequest) => wrap(getApi().orders.create(data)),
    updateStatus: (id: number, status: Order['status']) =>
      wrap(getApi().orders.updateStatus(id, status)),
  },
  statistics: {
    getToday: () => wrap(getApi().statistics.getToday() as Promise<Statistics>),
    getRevenue: (days: number = 7) =>
      wrap(getApi().statistics.getRevenue(days) as Promise<RevenueData[]>),
    getTopProducts: (limit: number = 5) =>
      wrap(getApi().statistics.getTopProducts(limit) as Promise<TopProduct[]>),
  },
};
