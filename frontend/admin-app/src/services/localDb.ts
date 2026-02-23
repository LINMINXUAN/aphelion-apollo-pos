import type {
  Category,
  Order,
  OrderItem,
  PlaceOrderRequest,
  Product,
  RevenueData,
  TopProduct,
} from '../types';

type DbState = {
  categories: Category[];
  products: Array<Product & { categoryId: number }>;
  orders: Order[];
  counters: {
    categoryId: number;
    productId: number;
    orderId: number;
    orderItemId: number;
  };
};

const STORAGE_KEY = 'pos-admin-local-db-v1';

const seedState = (): DbState => ({
  categories: [
    { id: 1, name: '主餐', displayOrder: 0, description: '飽足主食' },
    { id: 2, name: '飲品', displayOrder: 1, description: '咖啡與茶飲' },
    { id: 3, name: '點心', displayOrder: 2, description: '輕食甜點' },
  ],
  products: [
    {
      id: 1,
      name: '招牌蛋堡',
      description: '經典早餐，溫暖飽足',
      price: 55,
      categoryId: 1,
      categoryName: '主餐',
      available: true,
      imageUrl: '',
    },
    {
      id: 2,
      name: '熱美式',
      description: '香醇濃郁',
      price: 45,
      categoryId: 2,
      categoryName: '飲品',
      available: true,
      imageUrl: '',
    },
    {
      id: 3,
      name: '可頌',
      description: '酥香柔軟',
      price: 40,
      categoryId: 3,
      categoryName: '點心',
      available: true,
      imageUrl: '',
    },
  ],
  orders: [
    {
      id: 1,
      status: 'PENDING',
      type: 'DINE_IN',
      tableNumber: 'A1',
      totalAmount: 140,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 1,
          productName: '招牌蛋堡',
          quantity: 1,
          unitPrice: 55,
          subtotal: 55,
        },
        {
          id: 2,
          productName: '熱美式',
          quantity: 1,
          unitPrice: 45,
          subtotal: 45,
        },
        {
          id: 3,
          productName: '可頌',
          quantity: 1,
          unitPrice: 40,
          subtotal: 40,
        },
      ],
    },
  ],
  counters: {
    categoryId: 4,
    productId: 4,
    orderId: 2,
    orderItemId: 4,
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

const ensureCategoryName = (state: DbState, product: Product & { categoryId: number }) => {
  const category = state.categories.find((cat) => cat.id === product.categoryId);
  return {
    ...product,
    categoryName: category?.name || product.categoryName || '未分類',
  };
};

export const localDb = {
  categories: {
    list: () => withState((state) =>
      [...state.categories].sort((a, b) => a.displayOrder - b.displayOrder)
    ),
    create: (data: { name: string; description?: string; displayOrder?: number }) =>
      withState((state) => {
        const newCategory: Category = {
          id: state.counters.categoryId++,
          name: data.name.trim(),
          displayOrder: data.displayOrder ?? state.categories.length,
          description: data.description?.trim() || '',
        };
        state.categories.push(newCategory);
        return newCategory;
      }),
    update: (id: number, data: { name: string; description?: string; displayOrder?: number }) =>
      withState((state) => {
        const category = state.categories.find((cat) => cat.id === id);
        if (!category) throw new Error('分類不存在');
        category.name = data.name.trim();
        category.displayOrder = data.displayOrder ?? category.displayOrder;
        category.description = data.description?.trim() || '';
        state.products = state.products.map((product) =>
          product.categoryId === id
            ? { ...product, categoryName: category.name }
            : product
        );
        return category;
      }),
    remove: (id: number) =>
      withState((state) => {
        const index = state.categories.findIndex((cat) => cat.id === id);
        if (index === -1) throw new Error('分類不存在');
        const hasProducts = state.products.some((product) => product.categoryId === id);
        if (hasProducts) {
          throw new Error('刪除失敗，可能有商品使用此分類');
        }
        state.categories.splice(index, 1);
        state.products = state.products.map((product) =>
          product.categoryId === id ? { ...product, categoryId: 0, categoryName: '未分類' } : product
        );
        return { success: true };
      }),
  },
  products: {
    list: () =>
      withState((state) => state.products.map((product) => ensureCategoryName(state, product))),
    create: (data: any) =>
      withState((state) => {
        const categoryId = Number(data.categoryId);
        const newProduct: Product & { categoryId: number } = {
          id: state.counters.productId++,
          name: data.name.trim(),
          description: data.description || '',
          price: Number(data.price),
          categoryId,
          categoryName: '',
          available: Boolean(data.available),
          imageUrl: data.imageUrl || '',
        };
        const normalized = ensureCategoryName(state, newProduct);
        state.products.push(normalized);
        return normalized;
      }),
    update: (id: number, data: any) =>
      withState((state) => {
        const product = state.products.find((item) => item.id === id);
        if (!product) throw new Error('商品不存在');
        product.name = data.name.trim();
        product.description = data.description || '';
        product.price = Number(data.price);
        product.categoryId = Number(data.categoryId);
        product.available = Boolean(data.available);
        product.imageUrl = data.imageUrl || '';
        const normalized = ensureCategoryName(state, product);
        Object.assign(product, normalized);
        return normalized;
      }),
    remove: (id: number) =>
      withState((state) => {
        const index = state.products.findIndex((item) => item.id === id);
        if (index === -1) throw new Error('商品不存在');
        state.products.splice(index, 1);
        return { success: true };
      }),
  },
  orders: {
    list: () =>
      withState((state) =>
        [...state.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      ),
    create: (data: PlaceOrderRequest) =>
      withState((state) => {
        const items: OrderItem[] = data.items.map((item) => {
          const product = state.products.find((p) => p.id === item.productId);
          const unitPrice = product?.price ?? 0;
          return {
            id: state.counters.orderItemId++,
            productName: product?.name || '未知商品',
            quantity: item.quantity,
            unitPrice,
            modifiers: item.modifiers,
            subtotal: unitPrice * item.quantity,
          };
        });
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const order: Order = {
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
    updateStatus: (id: number, status: Order['status']) =>
      withState((state) => {
        const order = state.orders.find((item) => item.id === id);
        if (!order) throw new Error('訂單不存在');
        order.status = status;
        return order;
      }),
  },
  statistics: {
    getToday: () =>
      withState((state) => {
        const todayOrders = state.orders.length;
        const todayRevenue = state.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalProducts = state.products.length;
        const lowStockCount = 0;
        return { todayOrders, todayRevenue, totalProducts, lowStockCount };
      }),
    getRevenue: (days: number) =>
      withState((state) => {
        const result: RevenueData[] = [];
        for (let i = days - 1; i >= 0; i -= 1) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const label = date.toISOString().slice(0, 10);
          result.push({ date: label, revenue: 0 });
        }
        state.orders.forEach((order) => {
          const day = order.createdAt.slice(0, 10);
          const item = result.find((entry) => entry.date === day);
          if (item) item.revenue += order.totalAmount;
        });
        return result;
      }),
    getTopProducts: (limit: number) =>
      withState((state) => {
        const tally = new Map<string, TopProduct>();
        state.orders.forEach((order) => {
          order.items.forEach((item) => {
            const existing = tally.get(item.productName);
            if (existing) {
              existing.totalSold += item.quantity;
              existing.totalRevenue += item.subtotal;
            } else {
              tally.set(item.productName, {
                productId: item.id,
                productName: item.productName,
                totalSold: item.quantity,
                totalRevenue: item.subtotal,
              });
            }
          });
        });
        return [...tally.values()].sort((a, b) => b.totalSold - a.totalSold).slice(0, limit);
      }),
  },
};
