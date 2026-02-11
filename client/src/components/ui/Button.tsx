import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-rpg-accent hover:bg-rpg-accent-hover text-white',
  secondary: 'bg-rpg-surface hover:bg-rpg-border text-rpg-text border border-rpg-border',
  danger: 'bg-rpg-danger hover:bg-red-600 text-white',
  gold: 'bg-rpg-gold hover:bg-amber-600 text-black font-bold',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
