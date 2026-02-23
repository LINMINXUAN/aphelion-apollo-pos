import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, FolderPlus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductModal from '../components/ProductModal';
import CategoryModal from '../components/CategoryModal';
import { productAPI, categoryAPI } from '../services/api';
import type { Product } from '../types';
import toast from 'react-hot-toast';

export default function Products() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productAPI.getAll().then(res => res.data),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productAPI.delete(id).then(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('商品已刪除');
    },
    onError: () => {
      toast.error('刪除失敗');
    },
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => categoryAPI.delete(id).then(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('分類已刪除');
    },
    onError: () => {
      toast.error('刪除失敗，可能有商品使用此分類');
    },
  });

  return (
    <Layout title="產品管理">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
            <input
              type="text"
              placeholder="搜尋商品名稱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="admin-button admin-button-primary"
        >
          <Plus size={20} />
          新增商品
        </button>
      </div>

      {/* Category Management Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowCategoryManagement(!showCategoryManagement)}
          className="admin-button admin-button-ghost"
        >
          <FolderPlus size={20} />
          {showCategoryManagement ? '隱藏分類管理' : '顯示分類管理'}
        </button>

        {showCategoryManagement && (
          <div className="mt-4 admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink-900">分類管理</h3>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="admin-button admin-button-primary"
              >
                <Plus size={18} />
                新增分類
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-sand-100 rounded-xl border border-sand-200 hover:bg-sand-200/50 transition-colors"
                >
                  <div>
                    <span className="font-medium text-ink-900">{cat.name}</span>
                    {cat.description && (
                      <p className="text-sm text-ink-500 mt-1">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                    >
                      <Edit2 size={16} className="text-brand-600" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`確定刪除分類「${cat.name}」？`)) {
                          deleteCategoryMutation.mutate(cat.id);
                        }
                      }}
                      className="p-2 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 size={16} className="text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-500">載入中...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sand-100 text-left text-sm font-semibold text-ink-700">
                <th className="px-4 py-3 border-b border-sand-200 w-20">ID</th>
                <th className="px-4 py-3 border-b border-sand-200">商品名稱</th>
                <th className="px-4 py-3 border-b border-sand-200">分類</th>
                <th className="px-4 py-3 border-b border-sand-200 text-right">價格</th>
                <th className="px-4 py-3 border-b border-sand-200">狀態</th>
                <th className="px-4 py-3 border-b border-sand-200 w-32 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-sand-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-ink-600 border-b border-sand-100 font-mono">{product.id}</td>
                  <td className="px-4 py-3 text-sm text-ink-900 border-b border-sand-100 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-ink-600 border-b border-sand-100">{product.categoryName}</td>
                  <td className="px-4 py-3 text-sm text-ink-900 border-b border-sand-100 text-right font-mono">
                    NT$ {product.price.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 border-b border-sand-100">
                    <span className={`admin-chip ${product.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {product.available ? '上架中' : '已下架'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-sand-100">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-sand-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit2 size={16} className="text-brand-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`確定刪除「${product.name}」？`)) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="p-2 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={16} className="text-rose-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-ink-500">
        共 {filteredProducts.length} 項商品
        {searchTerm && ` (搜尋結果)`}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        categories={categories}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={editingCategory}
      />
    </Layout>
  );
}
