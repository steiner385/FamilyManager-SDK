import React, { useState } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
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
    timestamp?: (value: number) => string;
    value?: (value: number) => string;
  };
  ariaLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  size = { width: 400, height: 300 },
  styles = {},
  formatters = {},
  ariaLabel = "Line chart"
}) => {
  const [tooltipData, setTooltipData] = useState<DataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  const chartWidth = size.width - margin.left - margin.right;
  const chartHeight = size.height - margin.top - margin.bottom;

  if (data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center" 
        style={{ width: size.width, height: size.height }}
        data-testid="line-chart-empty"
      >
        <p>No data available</p>
      </div>
    );
  }

  // Scale data points to chart dimensions
  const xScale = (index: number) => {
    const min = 0;
    const max = data.length - 1;
    return margin.left + (index - min) * (chartWidth / (max - min));
  };

  const yScale = (value: number) => {
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));
    return margin.top + chartHeight - (value - min) * (chartHeight / (max - min));
  };

  // Format data points
  const formatTimestamp = formatters.timestamp || ((value: number) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  });
  const formatValue = formatters.value || ((value: number) => value.toString());

  // Generate path for line
  const linePath = data
    .map((point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const lineStyles = {
    stroke: styles.line?.stroke || "#2563eb",
    strokeWidth: styles.line?.strokeWidth || 2
  };

  const pointStyles = {
    fill: styles.point?.fill || "#1d4ed8",
    radius: styles.point?.radius || 4
  };

  const axisStyles = {
    stroke: styles.axis?.stroke || "#94a3b8",
    strokeWidth: styles.axis?.strokeWidth || 1
  };

  const handlePointHover = (point: DataPoint, event: React.MouseEvent) => {
    setTooltipData(point);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handlePointLeave = () => {
    setTooltipData(null);
    setTooltipPosition(null);
  };

  return (
    <div className="relative" role="img" aria-label={ariaLabel} data-testid="line-chart">
      <svg
        width={size.width}
        height={size.height}
        className="overflow-visible"
        data-testid="line-chart-svg"
      >
        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={size.height - margin.bottom}
          stroke={axisStyles.stroke}
          strokeWidth={axisStyles.strokeWidth}
          className="line-chart-axis"
        />
        <line
          x1={margin.left}
          y1={size.height - margin.bottom}
          x2={size.width - margin.right}
          y2={size.height - margin.bottom}
          stroke={axisStyles.stroke}
          strokeWidth={axisStyles.strokeWidth}
          className="line-chart-axis"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineStyles.stroke}
          strokeWidth={lineStyles.strokeWidth}
          className="line-chart-line"
        />

        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={xScale(index)}
            cy={yScale(point.value)}
            r={pointStyles.radius}
            fill={pointStyles.fill}
            className="line-chart-point"
            role="button"
            aria-label={`Data point for ${formatTimestamp(point.timestamp)}: ${point.value}`}
            data-testid="line-chart-point"
            onMouseEnter={(e) => handlePointHover(point, e)}
            onMouseLeave={handlePointLeave}
          />
        ))}

        {/* Labels */}
        {data.map((point, index) => (
          <React.Fragment key={`labels-${index}`}>
            <text
              x={xScale(index)}
              y={size.height - margin.bottom + 20}
              textAnchor="middle"
              className="text-sm fill-gray-600"
              data-testid="line-chart-x-label"
            >
              {formatTimestamp(point.timestamp)}
            </text>
            <text
              x={margin.left - 20}
              y={yScale(point.value)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-sm fill-gray-600"
              data-testid="line-chart-y-label"
            >
              {formatValue(point.value)}
            </text>
          </React.Fragment>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltipData && tooltipPosition && (
        <div
          className="absolute bg-white shadow-lg rounded p-2 text-sm"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translate(-50%, -100%)'
          }}
          data-testid="line-chart-tooltip"
        >
          <div>{formatTimestamp(tooltipData.timestamp)}</div>
          <div>{formatValue(tooltipData.value)}</div>
        </div>
      )}
    </div>
  );
};
