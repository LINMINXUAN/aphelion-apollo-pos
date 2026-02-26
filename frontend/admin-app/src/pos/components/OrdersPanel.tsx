import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { orderAPI } from '../../services/api';
import type { Order } from '../../types';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-sky-100 text-sky-800',
  SERVED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-sand-100 text-ink-600',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

const statusLabels: Record<string, string> = {
  PENDING: '待處理',
  PREPARING: '準備中',
  SERVED: '已送達',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const typeLabels: Record<string, string> = {
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

const IN_PROGRESS_STATUSES = ['PENDING', 'PREPARING', 'SERVED'];

export default function OrdersPanel() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => orderAPI.getAll().then((res) => res.data),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('訂單狀態已更新');
    },
    onError: () => {
      toast.error('更新失敗');
    },
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const inProgressOrders = orders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status));
  const processedOrders = orders.filter((o) => !IN_PROGRESS_STATUSES.includes(o.status));

  const OrderRow = ({ order }: { order: Order }) => (
    <tr
      onClick={() => setSelectedOrder(order)}
      className="hover:bg-sand-50 transition-colors duration-150 cursor-pointer"
    >
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
      <td className="px-4 py-3 border-b border-sand-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(order.id, option.value)}
              disabled={
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.id === order.id
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                order.status === option.value
                  ? `${statusColors[option.value]} ring-1 ring-inset ring-current/20`
                  : 'bg-sand-100 text-ink-500 hover:bg-sand-200 hover:text-ink-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 border-b border-sand-100 text-center">
        <Eye size={16} className="inline-block text-brand-600 opacity-70" title="查看詳情" />
      </td>
    </tr>
  );

  const TableHeader = () => (
    <tr className="bg-sand-100 text-left text-sm font-semibold text-ink-700">
      <th className="px-4 py-3 border-b border-sand-200">訂單編號</th>
      <th className="px-4 py-3 border-b border-sand-200">時間</th>
      <th className="px-4 py-3 border-b border-sand-200">類型</th>
      <th className="px-4 py-3 border-b border-sand-200">桌號</th>
      <th className="px-4 py-3 border-b border-sand-200 text-right">總額</th>
      <th className="px-4 py-3 border-b border-sand-200">狀態</th>
      <th className="px-4 py-3 border-b border-sand-200 text-center w-14" title="點擊整列可查看詳情">操作</th>
    </tr>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/80 border border-sand-200 rounded-2xl shadow-soft overflow-hidden flex-1 flex flex-col">
        {isLoading ? (
          <div className="p-8 text-center text-ink-500">載入中...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-ink-400">
            <p className="text-lg">尚無訂單</p>
            <p className="text-sm mt-2">點餐後訂單會顯示於此</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 flex flex-col">
            {/* 進行中 */}
            <div className="flex-shrink-0">
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-sm font-semibold text-amber-800">
                進行中 ({inProgressOrders.length})
              </div>
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <TableHeader />
                </thead>
                <tbody>
                  {inProgressOrders.length > 0 ? (
                    inProgressOrders.map((order) => <OrderRow key={order.id} order={order} />)
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-ink-400 text-sm">
                        無進行中訂單
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 已處理（可收合） */}
            {processedOrders.length > 0 && (
              <div className="flex-shrink-0 border-t border-sand-200">
                <button
                  onClick={() => setShowProcessed(!showProcessed)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-sand-100 hover:bg-sand-200 text-ink-700 text-sm font-medium transition-colors"
                >
                  {showProcessed ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                  已處理 ({processedOrders.length})
                </button>
                {showProcessed && (
                  <table className="w-full border-collapse min-w-[640px]">
                    <thead>
                      <TableHeader />
                    </thead>
                    <tbody>
                      {processedOrders.map((order) => (
                        <OrderRow key={order.id} order={order} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {orders.length > 0 && (
        <div className="mt-3 text-sm text-ink-500">
          進行中 {inProgressOrders.length} 筆 · 已處理 {processedOrders.length} 筆
        </div>
      )}

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
                  <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-ink-700 mb-2">訂單明細</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm p-3 bg-sand-100 rounded-xl border border-sand-200"
                    >
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
                className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-ink-700 rounded-xl text-sm font-medium transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
