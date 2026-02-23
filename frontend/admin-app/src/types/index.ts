export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryName: string;
  available: boolean;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  displayOrder: number;
  description?: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  modifiers?: string;
  subtotal: number;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  type: 'DINE_IN' | 'TAKEAWAY';
  tableNumber?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface PlaceOrderRequest {
  type: 'DINE_IN' | 'TAKEAWAY';
  tableNumber?: string;
  items: Array<{
    productId: number;
    quantity: number;
    modifiers?: string;
  }>;
}

export interface Statistics {
  todayRevenue: number;
  todayOrders: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}
