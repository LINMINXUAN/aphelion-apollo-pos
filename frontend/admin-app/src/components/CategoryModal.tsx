import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const categorySchema = z.object({
  name: z.string().min(2, '分類名稱至少2個字').max(30, '分類名稱最多30個字'),
  description: z.string().optional(),
  displayOrder: z.coerce.number().min(0, '排序順序不可為負數'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryFormData>,
    defaultValues: {
      name: '',
      description: '',
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        displayOrder: category.displayOrder || 0,
      });
    } else {
      reset({
        name: '',
        description: '',
        displayOrder: 0,
      });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (isEdit) {
        return categoryAPI.update(category.id, data);
      }
      return categoryAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(isEdit ? '分類更新成功' : '分類新增成功');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '操作失敗');
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lifted max-w-md w-full mx-4 border border-sand-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
          <h3 className="text-xl font-semibold text-ink-900">
            {isEdit ? '編輯分類' : '新增分類'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} className="text-ink-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              分類名稱 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              className="admin-input"
              placeholder="例：早餐"
            />
            {errors.name && (
              <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              分類描述
            </label>
            <textarea
              {...register('description')}
              className="admin-input"
              rows={2}
              placeholder="分類說明（選填）"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              排序順序
            </label>
            <input
              {...register('displayOrder')}
              type="number"
              className="admin-input"
              placeholder="0"
            />
            {errors.displayOrder && (
              <p className="text-rose-500 text-sm mt-1">{errors.displayOrder.message}</p>
            )}
            <p className="text-xs text-ink-500 mt-1">數字越小越靠前</p>
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
