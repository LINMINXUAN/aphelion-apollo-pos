import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'soldout' | 'hot' | 'new';
  children: ReactNode;
}

export default function Badge({ variant = 'hot', children }: BadgeProps) {
  const variantStyles = {
    soldout: 'bg-rose-100 text-rose-700',
    hot: 'bg-brand-100 text-brand-700',
    new: 'bg-sand-100 text-ink-700',
  };

  return <span className={`pos-pill ${variantStyles[variant]}`}>{children}</span>;
}
