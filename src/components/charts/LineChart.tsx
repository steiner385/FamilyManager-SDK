import React from 'react';

export interface LineChartProps {
  data: Array<{
    timestamp: number;
    value: number;
  }>;
  size?: {
    width: number;
    height: number;
  };
  styles?: {
    line?: {
      stroke?: string;
      strokeWidth?: number;
    };
    point?: {
      fill?: string;
      radius?: number;
    };
    axis?: {
      stroke?: string;
      strokeWidth?: number;
    };
  };
  formatters?: {
    timestamp?: (timestamp: number) => string;
    value?: (value: number) => string;
  };
  ariaLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  size = { width: 400, height: 300 },
  styles = {},
  formatters = {},
  ariaLabel = 'Line chart'
}) => {
  const defaultStyles = {
    line: {
      stroke: '#2563eb',
      strokeWidth: 2,
      ...styles.line
    },
    point: {
      fill: '#1d4ed8',
      radius: 4,
      ...styles.point
    },
    axis: {
      stroke: '#94a3b8',
      strokeWidth: 1,
      ...styles.axis
    }
  };

  const defaultFormatters = {
    timestamp: (ts: number) => new Date(ts).toLocaleDateString(),
    value: (val: number) => val.toString(),
    ...formatters
  };

  if (data.length === 0) {
    return (
      <div 
        data-testid="line-chart-empty"
        className="flex items-center justify-center w-full h-full"
      >
        No data available
      </div>
    );
  }

  // Calculate scales
  const timestamps = data.map(d => d.timestamp);
  const values = data.map(d => d.value);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getX = (timestamp: number) => {
    return (
      ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 
      (size.width - 60) + 30
    );
  };

  const getY = (value: number) => {
    return (
      size.height - 
      ((value - minValue) / (maxValue - minValue)) * (size.height - 60) - 30
    );
  };

  // Generate path for line
  const linePath = data
    .map((d, i) => {
      const x = getX(d.timestamp);
      const y = getY(d.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div 
      data-testid="line-chart"
      role="img"
      aria-label={ariaLabel}
      className="relative"
    >
      <svg
        data-testid="line-chart-svg"
        width={size.width}
        height={size.height}
        className="overflow-visible"
      >
        {/* Axes */}
        <line
          x1={30}
          y1={30}
          x2={30}
          y2={size.height - 30}
          className="line-chart-axis"
          stroke={defaultStyles.axis.stroke}
          strokeWidth={defaultStyles.axis.strokeWidth}
        />
        <line
          x1={30}
          y1={size.height - 30}
          x2={size.width - 30}
          y2={size.height - 30}
          className="line-chart-axis"
          stroke={defaultStyles.axis.stroke}
          strokeWidth={defaultStyles.axis.strokeWidth}
        />

        {/* Line */}
        <path
          d={linePath}
          className="line-chart-line"
          fill="none"
          stroke={defaultStyles.line.stroke}
          strokeWidth={defaultStyles.line.strokeWidth}
        />

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            data-testid="line-chart-point"
            role="button"
            aria-label={`Data point for ${defaultFormatters.timestamp(d.timestamp)}: ${defaultFormatters.value(d.value)}`}
            cx={getX(d.timestamp)}
            cy={getY(d.value)}
            r={defaultStyles.point.radius}
            className="line-chart-point"
            fill={defaultStyles.point.fill}
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => (
          <React.Fragment key={i}>
            <text
              data-testid="line-chart-x-label"
              x={getX(d.timestamp)}
              y={size.height - 10}
              textAnchor="middle"
              className="text-sm fill-gray-600"
            >
              {defaultFormatters.timestamp(d.timestamp)}
            </text>
            <text
              data-testid="line-chart-y-label"
              x={10}
              y={getY(d.value)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-sm fill-gray-600"
            >
              {defaultFormatters.value(d.value)}
            </text>
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};
