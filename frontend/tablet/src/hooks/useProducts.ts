import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ProductDTO } from '../types/api';

/**
 * Hook: 查詢所有商品列表
 * 後端 API 目前不支援篩選，需由前端自行過濾
 */
export const useProducts = () => {
  return useQuery<ProductDTO[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // 呼叫 API 取得所有商品
      return await api.get<ProductDTO[]>('/menu/products');
    },
    staleTime: 5 * 60 * 1000, // 5 分鐘快取
  });
};
