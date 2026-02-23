import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts();

  const filteredProducts = products
    ?.filter((p) => {
      if (!selectedCategory) return true;
      const category = categories?.find((c) => c.id === selectedCategory);
      return category ? p.categoryName === category.name : true;
    })
    .sort((a, b) => a.price - b.price);

  return (
    <div className="flex h-screen bg-sand-50 overflow-hidden">
      <aside className="w-56 bg-white/80 text-ink-800 flex flex-col shadow-soft z-20 border-r border-sand-200">
        <div className="p-4 border-b border-sand-200">
          <h1 className="text-lg font-semibold text-ink-900 tracking-wide">Aphelion POS</h1>
          <p className="text-xs text-ink-500 mt-1">點餐終端</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`
              w-full text-left px-4 py-3 rounded-xl font-semibold transition-all border
              ${selectedCategory === undefined
                ? 'bg-brand-50 text-brand-700 border-brand-100 shadow-soft'
                : 'text-ink-600 border-transparent hover:bg-sand-100 hover:text-ink-900'
              }
            `}
          >
            全部
          </button>

          {categoriesLoading ? (
            <div className="px-4 py-2 text-ink-500">載入中...</div>
          ) : (
            categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl font-semibold transition-all border
                  ${selectedCategory === category.id
                    ? 'bg-brand-50 text-brand-700 border-brand-100 shadow-soft'
                    : 'text-ink-600 border-transparent hover:bg-sand-100 hover:text-ink-900'
                  }
                `}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                  {category.name}
                </span>
              </button>
            ))
          )}
        </nav>

        <div className="p-4 border-t border-sand-200 mt-auto">
          <Link
            to="/"
            className="flex items-center justify-center w-full py-2 bg-sand-100 hover:bg-sand-200 text-ink-600 rounded-lg text-sm transition-colors border border-sand-200"
          >
            回到後台
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-sand-50">
        <div className="bg-white/80 border-b border-sand-200 px-6 py-4 flex justify-between items-center shadow-soft backdrop-blur">
          <h2 className="text-2xl font-semibold text-ink-900">
            {selectedCategory
              ? categories?.find((c) => c.id === selectedCategory)?.name || '商品列表'
              : '全部商品'}
            <span className="ml-3 text-lg font-normal text-ink-500">
              ({filteredProducts?.length || 0})
            </span>
          </h2>
          <Link
            to="/"
            className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-ink-700 rounded-lg text-sm transition-colors border border-sand-200"
          >
            返回後台
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="skeleton h-48 rounded-2xl"></div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-ink-400">
              <p className="text-xl">此分類無商品</p>
              <p className="text-sm mt-2">請切換其他分類</p>
            </div>
          )}
        </div>
      </main>

      <Cart />
    </div>
  );
}
