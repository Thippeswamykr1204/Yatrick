import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  glass = false,
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 lg:p-10',
  };

  return (
    <div
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white shadow-sm',
        glass && 'glass',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-300 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold tracking-tight text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-relaxed text-slate-500 mt-1', className)} {...props}>
      {children}
    </p>
  );
}