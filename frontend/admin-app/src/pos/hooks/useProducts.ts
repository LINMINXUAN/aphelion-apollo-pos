import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import type { Product } from '../../types';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productAPI.getAll().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
};
