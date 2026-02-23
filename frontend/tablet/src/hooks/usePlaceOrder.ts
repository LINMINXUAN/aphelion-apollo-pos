import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { OrderDTO, PlaceOrderRequest } from '../types/api';

/**
 * Hook: 送出訂單
 * 成功後會自動刷新訂單列表
 */
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderDTO, Error, PlaceOrderRequest>({
    mutationFn: async (orderData: PlaceOrderRequest) => {
      return await api.post<OrderDTO>('/orders/checkout', orderData);
    },
    onSuccess: () => {
      // 刷新訂單快取
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('訂單送出失敗:', error);
    },
  });
};
