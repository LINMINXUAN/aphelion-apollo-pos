const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('posApi', {
  categories: {
    list: () => ipcRenderer.invoke('categories:list'),
    create: (data) => ipcRenderer.invoke('categories:create', data),
    update: (id, data) => ipcRenderer.invoke('categories:update', id, data),
    delete: (id) => ipcRenderer.invoke('categories:delete', id),
  },
  products: {
    list: () => ipcRenderer.invoke('products:list'),
    getById: (id) => ipcRenderer.invoke('products:getById', id),
    create: (data) => ipcRenderer.invoke('products:create', data),
    update: (id, data) => ipcRenderer.invoke('products:update', id, data),
    delete: (id) => ipcRenderer.invoke('products:delete', id),
  },
  orders: {
    list: () => ipcRenderer.invoke('orders:list'),
    getById: (id) => ipcRenderer.invoke('orders:getById', id),
    create: (data) => ipcRenderer.invoke('orders:create', data),
    updateStatus: (id, status) => ipcRenderer.invoke('orders:updateStatus', id, status),
  },
  statistics: {
    getToday: () => ipcRenderer.invoke('statistics:getToday'),
    getRevenue: (days) => ipcRenderer.invoke('statistics:getRevenue', days),
    getTopProducts: (limit) => ipcRenderer.invoke('statistics:getTopProducts', limit),
  },
  updater: {
    getStatus: () => ipcRenderer.invoke('updater:getStatus'),
    checkNow: () => ipcRenderer.invoke('updater:checkNow'),
  },
});
