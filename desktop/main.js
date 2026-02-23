const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const { initUpdater, getStatus: getUpdateStatus, checkForUpdates } = require('./updater');

let db;

const getDbPath = () => path.join(app.getPath('userData'), 'pos.sqlite');

const initDatabase = () => {
  db = new Database(getDbPath());
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      category_id INTEGER,
      available INTEGER DEFAULT 1,
      image_url TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      table_number TEXT,
      total_amount REAL NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      modifiers TEXT,
      subtotal REAL NOT NULL
    );
  `);

  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoryCount === 0) {
    const insertCategory = db.prepare(
      'INSERT INTO categories (name, description, display_order) VALUES (@name, @description, @display_order)'
    );
    insertCategory.run({ name: '主餐', description: '飽足主食', display_order: 0 });
    insertCategory.run({ name: '飲品', description: '咖啡與茶飲', display_order: 1 });
    insertCategory.run({ name: '點心', description: '輕食甜點', display_order: 2 });

    const insertProduct = db.prepare(
      'INSERT INTO products (name, description, price, category_id, available, image_url) VALUES (@name, @description, @price, @category_id, @available, @image_url)'
    );
    insertProduct.run({
      name: '招牌蛋堡',
      description: '經典早餐，溫暖飽足',
      price: 55,
      category_id: 1,
      available: 1,
      image_url: '',
    });
    insertProduct.run({
      name: '熱美式',
      description: '香醇濃郁',
      price: 45,
      category_id: 2,
      available: 1,
      image_url: '',
    });
    insertProduct.run({
      name: '可頌',
      description: '酥香柔軟',
      price: 40,
      category_id: 3,
      available: 1,
      image_url: '',
    });
  }
};

const listCategories = () =>
  db
    .prepare(
      'SELECT id, name, description, display_order as displayOrder FROM categories ORDER BY display_order ASC'
    )
    .all();

const createCategory = (data) => {
  const stmt = db.prepare(
    'INSERT INTO categories (name, description, display_order) VALUES (?, ?, ?)'
  );
  const info = stmt.run(data.name.trim(), data.description || '', data.displayOrder ?? 0);
  return db
    .prepare('SELECT id, name, description, display_order as displayOrder FROM categories WHERE id = ?')
    .get(info.lastInsertRowid);
};

const updateCategory = (id, data) => {
  const stmt = db.prepare(
    'UPDATE categories SET name = ?, description = ?, display_order = ? WHERE id = ?'
  );
  stmt.run(data.name.trim(), data.description || '', data.displayOrder ?? 0, id);
  return db
    .prepare('SELECT id, name, description, display_order as displayOrder FROM categories WHERE id = ?')
    .get(id);
};

const deleteCategory = (id) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id).count;
  if (count > 0) {
    throw new Error('刪除失敗，可能有商品使用此分類');
  }
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  return { success: true };
};

const listProducts = () =>
  db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price,
        p.available as available,
        p.image_url as imageUrl,
        c.name as categoryName,
        p.category_id as categoryId
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC`
    )
    .all()
    .map((row) => ({
      ...row,
      categoryName: row.categoryName || '未分類',
      available: !!row.available,
    }));

const getProductById = (id) => {
  const row = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price,
        p.available as available,
        p.image_url as imageUrl,
        c.name as categoryName,
        p.category_id as categoryId
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?`
    )
    .get(id);
  if (!row) return null;
  return {
    ...row,
    categoryName: row.categoryName || '未分類',
    available: !!row.available,
  };
};

const createProduct = (data) => {
  const stmt = db.prepare(
    'INSERT INTO products (name, description, price, category_id, available, image_url) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(
    data.name.trim(),
    data.description || '',
    Number(data.price),
    Number(data.categoryId),
    data.available ? 1 : 0,
    data.imageUrl || ''
  );
  return getProductById(info.lastInsertRowid);
};

const updateProduct = (id, data) => {
  db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, available = ?, image_url = ? WHERE id = ?'
  ).run(
    data.name.trim(),
    data.description || '',
    Number(data.price),
    Number(data.categoryId),
    data.available ? 1 : 0,
    data.imageUrl || '',
    id
  );
  return getProductById(id);
};

const deleteProduct = (id) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return { success: true };
};

const getOrderItems = (orderId) =>
  db
    .prepare(
      `SELECT id, product_name as productName, quantity, unit_price as unitPrice, modifiers, subtotal
       FROM order_items WHERE order_id = ?`
    )
    .all(orderId);

const getOrderById = (id) => {
  const order = db
    .prepare(
      'SELECT id, status, type, table_number as tableNumber, total_amount as totalAmount, created_at as createdAt FROM orders WHERE id = ?'
    )
    .get(id);
  if (!order) return null;
  return { ...order, items: getOrderItems(id) };
};

const listOrders = () =>
  db
    .prepare(
      'SELECT id, status, type, table_number as tableNumber, total_amount as totalAmount, created_at as createdAt FROM orders ORDER BY created_at DESC'
    )
    .all()
    .map((order) => ({ ...order, items: getOrderItems(order.id) }));

const createOrder = (data) => {
  const now = new Date().toISOString();
  const items = data.items.map((item) => {
    const product = getProductById(item.productId);
    const unitPrice = product?.price ?? 0;
    return {
      productId: item.productId,
      productName: product?.name || '未知商品',
      quantity: item.quantity,
      unitPrice,
      modifiers: item.modifiers || null,
      subtotal: unitPrice * item.quantity,
    };
  });
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const insertOrder = db.prepare(
    'INSERT INTO orders (status, type, table_number, total_amount, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const orderId = insertOrder.run('PENDING', data.type, data.tableNumber || null, totalAmount, now)
    .lastInsertRowid;
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, modifiers, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertItems = db.transaction((orderIdValue) => {
    items.forEach((item) => {
      insertItem.run(
        orderIdValue,
        item.productId,
        item.productName,
        item.quantity,
        item.unitPrice,
        item.modifiers,
        item.subtotal
      );
    });
  });
  insertItems(orderId);
  return getOrderById(orderId);
};

const updateOrderStatus = (id, status) => {
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  return getOrderById(id);
};

const getStatisticsToday = () => {
  const today = new Date().toISOString().slice(0, 10);
  const orders = listOrders().filter((order) => order.createdAt.slice(0, 10) === today);
  const todayOrders = orders.length;
  const todayRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  return {
    todayRevenue,
    todayOrders,
    totalProducts,
    lowStockCount: 0,
  };
};

const getRevenue = (days = 7) => {
  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toISOString().slice(0, 10);
    result.push({ date: label, revenue: 0 });
  }
  listOrders().forEach((order) => {
    const day = order.createdAt.slice(0, 10);
    const entry = result.find((row) => row.date === day);
    if (entry) entry.revenue += order.totalAmount;
  });
  return result;
};

const getTopProducts = (limit = 5) => {
  return db
    .prepare(
      `SELECT product_name as productName,
        SUM(quantity) as totalSold,
        SUM(subtotal) as totalRevenue
      FROM order_items
      GROUP BY product_name
      ORDER BY totalSold DESC
      LIMIT ?`
    )
    .all(limit)
    .map((row, index) => ({
      productId: index + 1,
      productName: row.productName,
      totalSold: row.totalSold,
      totalRevenue: row.totalRevenue,
    }));
};

const registerIpcHandlers = () => {
  ipcMain.handle('categories:list', () => listCategories());
  ipcMain.handle('categories:create', (_, data) => createCategory(data));
  ipcMain.handle('categories:update', (_, id, data) => updateCategory(id, data));
  ipcMain.handle('categories:delete', (_, id) => deleteCategory(id));

  ipcMain.handle('products:list', () => listProducts());
  ipcMain.handle('products:getById', (_, id) => getProductById(id));
  ipcMain.handle('products:create', (_, data) => createProduct(data));
  ipcMain.handle('products:update', (_, id, data) => updateProduct(id, data));
  ipcMain.handle('products:delete', (_, id) => deleteProduct(id));

  ipcMain.handle('orders:list', () => listOrders());
  ipcMain.handle('orders:getById', (_, id) => getOrderById(id));
  ipcMain.handle('orders:create', (_, data) => createOrder(data));
  ipcMain.handle('orders:updateStatus', (_, id, status) => updateOrderStatus(id, status));

  ipcMain.handle('statistics:getToday', () => getStatisticsToday());
  ipcMain.handle('statistics:getRevenue', (_, days) => getRevenue(days));
  ipcMain.handle('statistics:getTopProducts', (_, limit) => getTopProducts(limit));

  ipcMain.handle('updater:getStatus', () => getUpdateStatus());
  ipcMain.handle('updater:checkNow', () => {
    checkForUpdates();
    return { triggered: true };
  });
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#FBFAF8',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.APP_DEV_URL;
  if (devUrl) {
    win.loadURL(devUrl);
    return;
  }

  if (app.isPackaged) {
    win.loadFile(path.join(process.resourcesPath, 'app', 'index.html'));
  } else {
    win.loadFile(path.join(__dirname, '..', 'frontend', 'admin-app', 'dist', 'index.html'));
  }
};

app.whenReady().then(() => {
  initDatabase();
  registerIpcHandlers();
  createWindow();
  initUpdater();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
