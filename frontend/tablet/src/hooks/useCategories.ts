import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { CategoryDTO } from '../types/api';

/**
 * Hook: 查詢商品分類列表
 */
export const useCategories = () => {
  return useQuery<CategoryDTO[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      return await api.get<CategoryDTO[]>('/menu/categories');
    },
    staleTime: 10 * 60 * 1000, // 10 分鐘快取（分類不常變動）
  });
};
