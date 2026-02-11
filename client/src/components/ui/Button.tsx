import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClasses = {
  primary: 'border border-white bg-black text-white hover:bg-white/10',
  secondary: 'border border-white/40 bg-black text-white/60 hover:border-white/70 hover:text-white/80',
  danger: 'border border-rpg-danger bg-black text-rpg-danger hover:bg-rpg-danger/10',
  gold: 'border border-rpg-gold bg-black text-rpg-gold hover:bg-rpg-gold/10',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} uppercase tracking-wider font-medium transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
