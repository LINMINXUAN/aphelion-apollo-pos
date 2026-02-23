import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card Component
 * 極簡溫暖風格卡片
 */
export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`pos-panel p-6 hover:shadow-elevated transition-shadow duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
