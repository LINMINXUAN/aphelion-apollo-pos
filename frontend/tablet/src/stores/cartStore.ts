import { create } from 'zustand';

// Cart Item 型別
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string;
}

// Cart Store 型別
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  itemCount: () => number;
}

/**
 * Zustand Cart Store
 * 管理購物車狀態
 */
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  // 新增商品至購物車
  addItem: (item) => {
    set((state) => {
      const index = state.items.findIndex((i) => i.productId === item.productId);
      if (index >= 0) {
        // 避免 map 全量迭代，僅複製必要節點。
        const items = [...state.items];
        const current = items[index];
        items[index] = { ...current, quantity: current.quantity + 1 };
        return { items };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  // 移除商品
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  // 更新商品數量
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((item) => item.productId !== productId)
          : state.items.map((item) =>
              item.productId === productId
                ? item.quantity === quantity
                  ? item
                  : { ...item, quantity }
                : item
            ),
    }));
  },

  // 清空購物車
  clearCart: () => {
    set({ items: [] });
  },

  // 計算總金額
  totalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // 計算商品總數
  itemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
