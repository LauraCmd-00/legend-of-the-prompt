import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children: ReactNode;
}

export default function Card({ selected, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`p-4 ${selected ? 'border-2 border-white bg-white/5' : 'border border-white/30'} transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
