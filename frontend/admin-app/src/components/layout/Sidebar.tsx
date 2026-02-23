import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, Monitor } from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '控制台' },
  { path: '/products', icon: Package, label: '產品管理' },
  { path: '/orders', icon: ShoppingCart, label: '訂單管理' },
  { path: '/settings', icon: Settings, label: '系統設定' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white/70 text-ink-800 min-h-screen flex flex-col border-r border-sand-200 backdrop-blur">
      {/* Logo */}
      <div className="p-6 border-b border-sand-200">
        <h1 className="text-xl font-semibold text-ink-900">Sunrise POS</h1>
        <p className="text-ink-500 text-sm mt-1">後台管理系統</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-ink-900 shadow-soft border border-sand-200'
                      : 'text-ink-600 hover:bg-sand-100 hover:text-ink-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sand-200">
        <Link
          to="/pos"
          className="flex items-center gap-3 px-4 py-3 text-ink-600 hover:bg-sand-100 hover:text-ink-900 rounded-xl transition-colors duration-200 cursor-pointer"
        >
          <Monitor size={20} />
          <span className="font-medium">POS 點餐</span>
        </Link>
      </div>
    </aside>
  );
}
