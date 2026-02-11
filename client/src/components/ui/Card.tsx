import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export default function Card({ selected, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-rpg-surface border rounded-xl p-4 transition-colors ${
        selected ? 'border-rpg-accent shadow-lg shadow-rpg-accent/20' : 'border-rpg-border'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
