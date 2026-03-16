import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
