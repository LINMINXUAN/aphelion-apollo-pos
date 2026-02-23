import { useQuery } from '@tanstack/react-query';
import { Settings as SettingsIcon, Clock, Users, Database } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { productAPI, orderAPI } from '../services/api';
import type { Order, Product } from '../types';

export default function Settings() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productAPI.getAll().then(res => res.data),
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => orderAPI.getAll().then(res => res.data),
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Layout title="系統設定">
      <div className="space-y-6">
        {/* System Info Section */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={24} className="text-brand-600" />
            <h2 className="text-xl font-semibold text-ink-900">系統資訊</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-ink-500">系統版本</label>
                <p className="text-lg font-semibold text-ink-900">v1.0.0</p>
              </div>
              <div>
                <label className="text-sm text-ink-500">資料庫</label>
                <p className="text-lg font-semibold text-ink-900">H2 Database (開發模式)</p>
              </div>
              <div>
                <label className="text-sm text-ink-500">啟動時間</label>
                <p className="text-lg font-semibold text-ink-900">{new Date().toLocaleDateString('zh-TW')}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-ink-500">總商品數</label>
                <p className="text-lg font-semibold text-brand-600 font-mono">{products.length} 項</p>
              </div>
              <div>
                <label className="text-sm text-ink-500">總訂單數</label>
                <p className="text-lg font-semibold text-brand-600 font-mono">{orders.length} 筆</p>
              </div>
              <div>
                <label className="text-sm text-ink-500">累計營收</label>
                <p className="text-lg font-semibold text-emerald-600 font-mono">
                  NT$ {totalRevenue.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-brand-600" />
            <h2 className="text-xl font-semibold text-ink-900">營業設定</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">開始時間</label>
                <input
                  type="time"
                  defaultValue="06:00"
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">結束時間</label>
                <input
                  type="time"
                  defaultValue="14:00"
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">休息日</label>
              <div className="flex gap-2">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, idx) => (
                  <button
                    key={day}
                    className={`px-4 py-2 rounded-xl border cursor-pointer transition-colors ${
                      idx === 0
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-ink-700 border-sand-200 hover:bg-sand-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Management Section */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-brand-600" />
            <h2 className="text-xl font-semibold text-ink-900">桌號管理</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">可用桌號</label>
              <div className="flex flex-wrap gap-2">
                {['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1'].map((table) => (
                  <span
                    key={table}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-sand-100 text-ink-700 font-medium border border-sand-200"
                  >
                    {table}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="admin-button admin-button-primary">
              + 新增桌號
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon size={24} className="text-brand-600" />
            <h2 className="text-xl font-semibold text-ink-900">系統維護</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-3 bg-sand-100 text-ink-700 rounded-xl hover:bg-sand-200 transition-colors cursor-pointer text-left border border-sand-200">
              <div className="font-semibold">清除快取</div>
              <div className="text-sm text-ink-500">清除系統暫存資料</div>
            </button>
            <button className="px-4 py-3 bg-sand-100 text-ink-700 rounded-xl hover:bg-sand-200 transition-colors cursor-pointer text-left border border-sand-200">
              <div className="font-semibold">資料備份</div>
              <div className="text-sm text-ink-500">匯出資料庫備份</div>
            </button>
            <button className="px-4 py-3 bg-sand-100 text-ink-700 rounded-xl hover:bg-sand-200 transition-colors cursor-pointer text-left border border-sand-200">
              <div className="font-semibold">檢視日誌</div>
              <div className="text-sm text-ink-500">查看系統運行記錄</div>
            </button>
            <button className="px-4 py-3 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer text-left border border-rose-100">
              <div className="font-semibold">重啟系統</div>
              <div className="text-sm text-rose-500">重新啟動後端服務</div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="admin-button admin-button-primary px-6 py-3">
            儲存設定
          </button>
        </div>
      </div>
    </Layout>
  );
}
