import React from 'react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export interface MetricsCardProps {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  timeframe: string;
  formatters?: {
    value?: (val: number) => string;
    change?: (val: number) => string;
  };
  styles?: {
    card?: string;
    title?: string;
    value?: string;
    change?: string;
    timeframe?: string;
  };
  loading?: boolean;
  error?: string;
  tooltip?: string;
  ariaLabel?: string;
  onClick?: (data: Omit<MetricsCardProps, 'onClick'>) => void;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  trend,
  change,
  timeframe,
  formatters = {},
  styles = {},
  loading = false,
  error,
  tooltip,
  ariaLabel,
  onClick
}) => {
  const defaultStyles = {
    card: `bg-white rounded-lg shadow-sm p-4 ${styles.card || ''}`,
    title: `text-gray-600 text-sm font-medium ${styles.title || ''}`,
    value: `text-gray-900 text-2xl font-semibold mt-1 ${styles.value || ''}`,
    change: `${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'} ${styles.change || ''}`,
    timeframe: `text-gray-500 text-sm ${styles.timeframe || ''}`
  };

  const defaultFormatters = {
    value: (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    change: (val: number) => `${val > 0 ? '+' : ''}${val}%`
  };

  const formatValue = formatters.value || defaultFormatters.value;
  const formatChange = formatters.change || defaultFormatters.change;

  if (loading) {
    return (
      <div 
        data-testid="metrics-card-skeleton"
        className={defaultStyles.card}
      >
        <LoadingSkeleton className="h-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        data-testid="metrics-card"
        className={`${defaultStyles.card} text-red-500`}
      >
        {error}
      </div>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick({
        title,
        value,
        trend,
        change,
        timeframe,
        formatters,
        styles,
        loading,
        error,
        tooltip,
        ariaLabel
      });
    }
  };

  const changeLabel = `${trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Changed'} by ${Math.abs(change)} percent ${timeframe}`;

  return (
    <div
      data-testid="metrics-card"
      className={defaultStyles.card}
      role="region"
      aria-label={ariaLabel || title}
      onClick={onClick ? handleClick : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-center justify-between">
        <h3 className={defaultStyles.title}>{title}</h3>
        {tooltip && (
          <div 
            data-testid="metrics-card-info"
            className="relative group"
          >
            <svg 
              className="w-4 h-4 text-gray-400 hover:text-gray-500"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded p-2 -right-2 transform translate-x-full -translate-y-1/2">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className={defaultStyles.value}>
        {formatValue(value)}
      </div>
      <div className="flex items-center mt-2">
        <span 
          className={defaultStyles.change}
          aria-label={changeLabel}
        >
          {formatChange(change)}
        </span>
        <span className={defaultStyles.timeframe}>
          &nbsp;{timeframe}
        </span>
      </div>
    </div>
  );
};
