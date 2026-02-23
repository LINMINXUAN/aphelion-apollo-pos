// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

// Product DTO (Matches ProductResponse.java)
export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryName: string; // Updated from categoryId
  available: boolean;
  imageUrl?: string; // Optional: Frontend only for now
}

// Category DTO (Matches CategoryResponse.java)
export interface CategoryDTO {
  id: number;
  name: string;
  displayOrder?: number; // Added
  icon?: string; // Optional: Frontend only
}

// Order Status
export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

// Order Type
export type OrderType = 'DINE_IN' | 'TAKEAWAY';

// Order DTO (Matches OrderResponse.java)
export interface OrderDTO {
  id: number;
  status: OrderStatus;
  type: OrderType;
  tableNumber?: string;
  totalAmount: number;
  createdAt: string; // ISO 8601 String from LocalDateTime
  items: OrderItemDTO[];
}

// Order Item DTO
export interface OrderItemDTO {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  modifiers?: string;
  subtotal: number;
}

// Place Order Request
export interface PlaceOrderRequest {
  type: OrderType;
  tableNumber?: string;
  items: CartItemRequest[];
}

// Cart Item Request
export interface CartItemRequest {
  productId: number;
  quantity: number;
  modifiers?: string;
}
