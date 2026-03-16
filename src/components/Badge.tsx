import React from 'react';
import { cn } from './Button';
import { Category, Status } from '../types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: Category | Status | 'default';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const styles: Record<string, string> = {
    // Categories
    Medical: 'bg-red-100 text-red-700 border-red-200',
    Security: 'bg-amber-100 text-amber-700 border-amber-200',
    Fire: 'bg-orange-100 text-orange-700 border-orange-200',
    Facility: 'bg-blue-100 text-blue-700 border-blue-200',
    Other: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    
    // Statuses
    Sent: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    Received: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'On the Way': 'bg-sky-100 text-sky-700 border-sky-200',
    Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through',
    
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
      styles[variant as string] || styles.default,
      className
    )}>
      {children}
    </span>
  );
}
