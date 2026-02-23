import { create } from 'zustand';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const index = state.items.findIndex((i) => i.productId === item.productId);
      if (index >= 0) {
        const items = [...state.items];
        const current = items[index];
        items[index] = { ...current, quantity: current.quantity + 1 };
        return { items };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
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
  clearCart: () => set({ items: [] }),
  totalAmount: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
