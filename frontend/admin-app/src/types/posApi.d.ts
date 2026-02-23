import type {
  Category,
  Order,
  PlaceOrderRequest,
  Product,
  RevenueData,
  Statistics,
  TopProduct,
} from './index';

export {};

declare global {
  interface Window {
    posApi?: {
      categories: {
        list: () => Promise<Category[]>;
        create: (data: Partial<Category>) => Promise<Category>;
        update: (id: number, data: Partial<Category>) => Promise<Category>;
        delete: (id: number) => Promise<{ success: true }>;
      };
      products: {
        list: () => Promise<Product[]>;
        getById: (id: number) => Promise<Product | null>;
        create: (data: Partial<Product>) => Promise<Product>;
        update: (id: number, data: Partial<Product>) => Promise<Product>;
        delete: (id: number) => Promise<{ success: true }>;
      };
      orders: {
        list: () => Promise<Order[]>;
        getById: (id: number) => Promise<Order | null>;
        create: (data: PlaceOrderRequest) => Promise<Order>;
        updateStatus: (id: number, status: Order['status']) => Promise<Order>;
      };
      statistics: {
        getToday: () => Promise<Statistics>;
        getRevenue: (days: number) => Promise<RevenueData[]>;
        getTopProducts: (limit: number) => Promise<TopProduct[]>;
      };
    };
  }
}
