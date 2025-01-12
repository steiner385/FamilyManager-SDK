import { Card } from '@components/common/Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MetricsCardProps {
  title: string;
  value: number;
  trend: number;
  unit?: string;
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  trend, 
  unit, 
  className = '' 
}: MetricsCardProps) {
  const trendColor = trend > 0 ? 'text-success-500' : 'text-error-500';
  const TrendIcon = trend > 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Card className={`${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="text-sm font-medium text-gray-500 truncate">
          {title}
        </div>
        <div className="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-gray-900">
            {value}
            {unit && <span className="ml-2 text-sm font-medium text-gray-500">{unit}</span>}
          </div>

          <div className={`flex items-baseline text-sm font-semibold ${trendColor}`}>
            <TrendIcon className="self-center flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span className="ml-2">
              {Math.abs(trend)}%
            </span>
            <span className="sr-only">
              {trend > 0 ? 'Increased' : 'Decreased'} by
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
