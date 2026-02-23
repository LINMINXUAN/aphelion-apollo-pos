import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '../../services/api';
import type { Category } from '../../types';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((res) => res.data),
    staleTime: 10 * 60 * 1000,
  });
};
