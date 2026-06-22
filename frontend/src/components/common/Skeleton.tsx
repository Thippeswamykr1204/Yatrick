import { cn } from '@/lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
  style,
  ...props
}: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
      'skeleton animate-pulse',
      roundedMap[rounded],
      className
    )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export function TripCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
      <Skeleton height="160px" rounded="lg" className="w-full" />
      <div className="space-y-2">
        <Skeleton height="24px" className="w-3/4" />
        <Skeleton height="16px" className="w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton height="24px" className="w-16" rounded="full" />
        <Skeleton height="24px" className="w-20" rounded="full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="16px" className="w-24" />
        <Skeleton height="36px" className="w-28" rounded="lg" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
            <Skeleton height="20px" className="w-1/2" />
            <Skeleton height="36px" className="w-1/3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}