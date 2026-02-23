import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, ChevronDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { orderAPI } from '../services/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-sky-100 text-sky-800',
  SERVED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-sand-100 text-ink-600',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

const statusLabels = {
  PENDING: '待處理',
  PREPARING: '準備中',
  SERVED: '已送達',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const typeLabels = {
  DINE_IN: '內用',
  TAKEAWAY: '外帶',
};

const statusOptions = [
  { value: 'PENDING', label: '待處理' },
  { value: 'PREPARING', label: '準備中' },
  { value: 'SERVED', label: '已送達' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
];

export default function Orders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<number | null>(null);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => orderAPI.getAll().then(res => res.data),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('訂單狀態已更新');
      setStatusDropdown(null);
    },
    onError: () => {
      toast.error('更新失敗');
    },
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <Layout title="訂單管理">
      {/* Orders Table */}
      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-500">載入中...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sand-100 text-left text-sm font-semibold text-ink-700">
                <th className="px-4 py-3 border-b border-sand-200">訂單編號</th>
                <th className="px-4 py-3 border-b border-sand-200">時間</th>
                <th className="px-4 py-3 border-b border-sand-200">類型</th>
                <th className="px-4 py-3 border-b border-sand-200">桌號</th>
                <th className="px-4 py-3 border-b border-sand-200 text-right">總額</th>
                <th className="px-4 py-3 border-b border-sand-200">狀態</th>
                <th className="px-4 py-3 border-b border-sand-200 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-sand-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-ink-900 border-b border-sand-100 font-mono">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 border-b border-sand-100">
                    {new Date(order.createdAt).toLocaleString('zh-TW', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 border-b border-sand-100">
                    {typeLabels[order.type]}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 border-b border-sand-100">
                    {order.tableNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-900 border-b border-sand-100 text-right font-mono">
                    NT$ {order.totalAmount.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 border-b border-sand-100 relative">
                    <button
                      onClick={() => setStatusDropdown(statusDropdown === order.id ? null : order.id)}
                      className={`admin-chip cursor-pointer hover:opacity-80 transition-opacity ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                      <ChevronDown size={14} />
                    </button>

                    {/* Status Dropdown */}
                    {statusDropdown === order.id && (
                      <div className="absolute mt-1 bg-white border border-sand-200 rounded-xl shadow-soft z-10 min-w-[120px]">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(order.id, option.value)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-sand-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 border-b border-sand-100">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-sand-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Eye size={16} className="text-brand-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-ink-500">
        共 {orders.length} 筆訂單
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lifted max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-sand-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-sand-200">
              <h3 className="text-xl font-semibold text-ink-900">
                訂單詳情 #{selectedOrder.id}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-ink-500">時間:</span>
                  <span className="ml-2 text-ink-900">
                    {new Date(selectedOrder.createdAt).toLocaleString('zh-TW')}
                  </span>
                </div>
                <div>
                  <span className="text-ink-500">類型:</span>
                  <span className="ml-2 text-ink-900">{typeLabels[selectedOrder.type]}</span>
                </div>
                <div>
                  <span className="text-ink-500">桌號:</span>
                  <span className="ml-2 text-ink-900">{selectedOrder.tableNumber || '外帶'}</span>
                </div>
                <div>
                  <span className="text-ink-500">狀態:</span>
                  <span
                    className={`ml-2 admin-chip ${statusColors[selectedOrder.status]}`}
                  >
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-ink-700 mb-2">訂單明細</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-3 bg-sand-100 rounded-xl border border-sand-200">
                      <div>
                        <span className="font-medium text-ink-900">{item.productName}</span>
                        <span className="text-ink-500 ml-2">x {item.quantity}</span>
                      </div>
                      <span className="font-mono text-ink-900">
                        NT$ {item.subtotal.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-sand-200">
                <span className="text-lg font-semibold text-ink-900">總計</span>
                <span className="text-2xl font-semibold text-brand-600 font-mono">
                  NT$ {selectedOrder.totalAmount.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-sand-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="admin-button admin-button-ghost"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
