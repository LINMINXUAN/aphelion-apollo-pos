import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Package, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { statisticsAPI } from '../services/api';

function StatCard({ title, value, icon: Icon, trend, accent }: any) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-ink-900">{value}</p>
          {trend && (
            <p className="text-sm text-emerald-600 mt-2">
              ↑ {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent.bg}`}>
          <Icon size={22} className={accent.icon} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics-today'],
    queryFn: () => statisticsAPI.getToday().then(res => res.data),
    // Mock data for now
    placeholderData: {
      todayRevenue: 15420,
      todayOrders: 87,
      totalProducts: 14,
      lowStockCount: 2,
    },
  });

  if (isLoading) {
    return (
      <Layout title="控制台">
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="控制台">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="今日營收"
          value={`NT$ ${stats?.todayRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend="+12.5%"
          accent={{ bg: 'bg-emerald-100', icon: 'text-emerald-700' }}
        />
        <StatCard
          title="今日訂單"
          value={stats?.todayOrders}
          icon={ShoppingBag}
          trend="+8.2%"
          accent={{ bg: 'bg-sky-100', icon: 'text-sky-700' }}
        />
        <StatCard
          title="總商品數"
          value={stats?.totalProducts}
          icon={Package}
          accent={{ bg: 'bg-violet-100', icon: 'text-violet-700' }}
        />
        <StatCard
          title="庫存警示"
          value={stats?.lowStockCount}
          icon={AlertCircle}
          accent={{ bg: 'bg-amber-100', icon: 'text-amber-700' }}
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-5">
          <h3 className="text-lg font-semibold mb-4 text-ink-900">7日營收趨勢</h3>
          <div className="h-64 flex items-center justify-center bg-sand-100 rounded-xl border border-sand-200">
            <p className="text-ink-400">Chart will be here</p>
          </div>
        </div>
        
        <div className="admin-card p-5">
          <h3 className="text-lg font-semibold mb-4 text-ink-900">熱銷商品 Top 5</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-sand-100 rounded-xl border border-sand-200">
                <span className="text-sm font-medium text-ink-900">商品 #{i}</span>
                <span className="text-sm text-ink-600">已售 {100 - i * 10} 份</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
