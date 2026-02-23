import type { CategoryDTO, OrderDTO, OrderItemDTO, PlaceOrderRequest, ProductDTO } from '../types/api';

type DbState = {
  categories: CategoryDTO[];
  products: ProductDTO[];
  orders: OrderDTO[];
  counters: {
    orderId: number;
    orderItemId: number;
  };
};

const STORAGE_KEY = 'pos-tablet-local-db-v1';

const seedState = (): DbState => ({
  categories: [
    { id: 1, name: '主餐', displayOrder: 0 },
    { id: 2, name: '飲品', displayOrder: 1 },
    { id: 3, name: '點心', displayOrder: 2 },
  ],
  products: [
    {
      id: 1,
      name: '招牌蛋堡',
      description: '經典早餐，溫暖飽足',
      price: 55,
      categoryName: '主餐',
      available: true,
      imageUrl: '',
    },
    {
      id: 2,
      name: '熱美式',
      description: '香醇濃郁',
      price: 45,
      categoryName: '飲品',
      available: true,
      imageUrl: '',
    },
    {
      id: 3,
      name: '可頌',
      description: '酥香柔軟',
      price: 40,
      categoryName: '點心',
      available: true,
      imageUrl: '',
    },
  ],
  orders: [],
  counters: {
    orderId: 1,
    orderItemId: 1,
  },
});

const loadState = (): DbState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState();
  try {
    return JSON.parse(raw) as DbState;
  } catch {
    return seedState();
  }
};

const saveState = (state: DbState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const withState = <T>(fn: (state: DbState) => T): T => {
  const state = loadState();
  const result = fn(state);
  saveState(state);
  return result;
};

const buildOrderItems = (state: DbState, request: PlaceOrderRequest): OrderItemDTO[] =>
  request.items.map((item) => {
    const product = state.products.find((p) => p.id === item.productId);
    const unitPrice = product?.price ?? 0;
    const subtotal = unitPrice * item.quantity;
    const orderItem: OrderItemDTO = {
      id: state.counters.orderItemId++,
      productName: product?.name || '未知商品',
      quantity: item.quantity,
      unitPrice,
      modifiers: item.modifiers,
      subtotal,
    };
    return orderItem;
  });

export const localDb = {
  categories: {
    list: () => withState((state) =>
      [...state.categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    ),
  },
  products: {
    list: () => withState((state) => state.products),
  },
  orders: {
    create: (data: PlaceOrderRequest) =>
      withState((state) => {
        const items = buildOrderItems(state, data);
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const order: OrderDTO = {
          id: state.counters.orderId++,
          status: 'PENDING',
          type: data.type,
          tableNumber: data.tableNumber,
          totalAmount,
          createdAt: new Date().toISOString(),
          items,
        };
        state.orders.unshift(order);
        return order;
      }),
  },
};
