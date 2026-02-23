import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const productSchema = z.object({
  name: z.string().min(2, '商品名稱至少2個字').max(50, '商品名稱最多50個字'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, '價格必須大於0'),
  categoryId: z.coerce.number().min(1, '請選擇分類'),
  imageUrl: z.string().url('請輸入有效的圖片URL').or(z.literal('')),
  available: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  categories: any[];
}

export default function ProductModal({ isOpen, onClose, product, categories }: ProductModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: 1,
      imageUrl: '',
      available: true,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        categoryId: product.categoryId || 1,
        imageUrl: product.imageUrl || '',
        available: product.available,
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        categoryId: 1,
        imageUrl: '',
        available: true,
      });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      if (isEdit) {
        return productAPI.update(product.id, data);
      }
      return productAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEdit ? '商品更新成功' : '商品新增成功');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '操作失敗');
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lifted max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-sand-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
          <h3 className="text-xl font-semibold text-ink-900">
            {isEdit ? '編輯商品' : '新增商品'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} className="text-ink-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              商品名稱 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              className="admin-input"
              placeholder="例：起司蛋堡"
            />
            {errors.name && (
              <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              商品描述
            </label>
            <textarea
              {...register('description')}
              className="admin-input"
              rows={3}
              placeholder="商品說明（選填）"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                價格 (NT$) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                className="admin-input"
                placeholder="45"
              />
              {errors.price && (
                <p className="text-rose-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                分類 <span className="text-red-500">*</span>
              </label>
              <select
                {...register('categoryId')}
                className="admin-input cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-rose-500 text-sm mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              圖片 URL
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              className="admin-input"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-rose-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Available Toggle */}
          <div className="flex items-center gap-3">
            <input
              {...register('available')}
              type="checkbox"
              id="available"
              className="w-4 h-4 text-brand-500 border-sand-300 rounded focus:ring-brand-300 cursor-pointer"
            />
            <label htmlFor="available" className="text-sm font-medium text-ink-700 cursor-pointer">
              上架販售
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-sand-200">
            <button
              type="button"
              onClick={onClose}
              className="admin-button admin-button-ghost"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="admin-button admin-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? '處理中...' : isEdit ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
