import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import { usePlaceOrder } from '../hooks/usePlaceOrder';

type OrderType = 'DINE_IN' | 'TAKEAWAY';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount, itemCount } = useCartStore();
  const placeOrderMutation = usePlaceOrder();
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      await placeOrderMutation.mutateAsync({
        type: orderType,
        tableNumber: orderType === 'DINE_IN' ? 'A1' : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          modifiers: item.modifiers,
        })),
      });
      clearCart();
    } catch {
      alert('訂單送出失敗，請稍後再試');
    }
  };

  return (
    <aside className="w-96 bg-sand-50 border-l border-sand-200 flex flex-col h-full shadow-soft z-20">
      <div className="p-4 bg-white/80 border-b border-sand-200 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-ink-900">訂單內容</h2>
          <button
            onClick={clearCart}
            disabled={items.length === 0}
            className="text-rose-500 hover:text-rose-700 text-sm font-medium disabled:opacity-50"
          >
            清空
          </button>
        </div>

        <div className="flex bg-sand-100 p-1 rounded-xl border border-sand-200">
          <button
            onClick={() => setOrderType('DINE_IN')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
              orderType === 'DINE_IN'
                ? 'bg-white text-brand-600 shadow-soft'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            內用
          </button>
          <button
            onClick={() => setOrderType('TAKEAWAY')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
              orderType === 'TAKEAWAY'
                ? 'bg-white text-brand-600 shadow-soft'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            外帶
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sand-50">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400">
            <p className="text-lg">尚未點餐</p>
            <p className="text-sm mt-2 text-ink-400">點選左側商品即可加入</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="pos-card p-4 flex flex-col gap-2 animate-flash">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-ink-900 text-lg leading-tight">
                  {item.name}
                </span>
                <span className="font-semibold text-ink-900">
                  NT$ {item.price * item.quantity}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-10 h-10 rounded-lg bg-sand-100 text-ink-700 font-bold text-xl hover:bg-sand-200 flex items-center justify-center touch-manipulation border border-sand-200"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-ink-900 w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 font-bold text-xl hover:bg-brand-200 flex items-center justify-center touch-manipulation"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-ink-400 hover:text-rose-500 p-2 text-sm"
                >
                  <span className="sr-only">Remove</span>
                  移除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white/80 border-t border-sand-200 shadow-soft">
        <div className="flex justify-between items-end mb-4">
          <span className="text-ink-600 font-medium">總計 ({itemCount()} 項)</span>
          <span className="text-4xl font-semibold text-brand-600">
            NT$ {totalAmount()}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || placeOrderMutation.isPending}
          className={`
            w-full py-4 rounded-xl text-xl font-semibold text-white shadow-soft
            transition-all transform active:scale-[0.98]
            ${items.length === 0
              ? 'bg-sand-300 cursor-not-allowed text-ink-500'
              : 'bg-brand-500 hover:bg-brand-600'
            }
          `}
        >
          {placeOrderMutation.isPending ? '處理中...' : '結帳 / 送單'}
        </button>
      </div>
    </aside>
  );
}
