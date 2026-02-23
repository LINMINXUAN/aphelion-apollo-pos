import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white/70 border-b border-sand-200 px-8 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink-900">{title}</h1>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-sand-100 rounded-lg transition-colors cursor-pointer">
            <Bell size={20} className="text-ink-600" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-sand-200">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-ink-900">Admin</p>
              <p className="text-ink-500">管理員</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
