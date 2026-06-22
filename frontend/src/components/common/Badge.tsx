import { cn } from '@/lib/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

const variants = {
  default:
    'bg-slate-100 text-slate-700 border border-slate-200',
  success:
    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning:
    'bg-amber-50 text-amber-700 border border-amber-200',
  danger:
    'bg-red-50 text-red-700 border border-red-200',
  info:
    'bg-blue-50 text-blue-700 border border-blue-200',
  purple:
    'bg-indigo-50 text-indigo-700 border border-indigo-200',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold tracking-tight transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}