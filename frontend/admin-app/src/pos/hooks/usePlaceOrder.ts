import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../../services/api';
import type { Order, PlaceOrderRequest } from '../../types';

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, PlaceOrderRequest>({
    mutationFn: async (orderData: PlaceOrderRequest) => {
      const response = await orderAPI.create(orderData);
      return response.data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['statistics-today'] });
    },
    onError: (error) => {
      console.error('訂單送出失敗:', error);
    },
  });
};
