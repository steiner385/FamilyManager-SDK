import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { LineChart, type LineChartProps } from '../components/charts/LineChart';

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { timestamp: 1672531200000, value: 100 }, // 2023-01-01
  { timestamp: 1672617600000, value: 150 }, // 2023-01-02
  { timestamp: 1672704000000, value: 120 }, // 2023-01-03
  { timestamp: 1672790400000, value: 180 }, // 2023-01-04
  { timestamp: 1672876800000, value: 160 }, // 2023-01-05
];

export const Default: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if chart is rendered
    const chart = canvas.getByTestId('line-chart');
    await expect(chart).toBeVisible();
    
    // Check SVG elements
    const svg = canvas.getByTestId('line-chart-svg');
    await expect(svg).toBeVisible();
    
    // Check data points
    const points = canvas.getAllByTestId('line-chart-point');
    await expect(points).toHaveLength(5);
    
    // Check axes
    const axes = canvas.getAllByTestId('line-chart-svg').flatMap(svg => 
      Array.from(svg.querySelectorAll('line'))
    );
    await expect(axes).toHaveLength(2);
    
    // Check labels
    const xLabels = canvas.getAllByTestId('line-chart-x-label');
    const yLabels = canvas.getAllByTestId('line-chart-y-label');
    await expect(xLabels).toHaveLength(5);
    await expect(yLabels).toHaveLength(5);
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    size: { width: 600, height: 400 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check empty state message
    const emptyState = canvas.getByTestId('line-chart-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveTextContent('No data available');
    
    // Verify chart elements are not rendered
    const points = canvas.queryAllByTestId('line-chart-point');
    await expect(points).toHaveLength(0);
  },
};

export const WithTooltip: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Hover over a data point
    const points = canvas.getAllByTestId('line-chart-point');
    await userEvent.hover(points[2]);
    
    // Check if tooltip appears
    const tooltip = canvas.getByTestId('line-chart-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveTextContent('Jan 3, 2023');
    await expect(tooltip).toHaveTextContent('120');
    
    // Unhover to hide tooltip
    await userEvent.unhover(points[2]);
    await expect(canvas.queryByTestId('line-chart-tooltip')).toBeNull();
  },
};

export const CustomFormatters: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
    formatters: {
      timestamp: (value) => new Date(value).toLocaleDateString('en-US', { 
        weekday: 'short',
      }),
      value: (value) => `$${value.toLocaleString()}`,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check custom formatted labels
    const xLabels = canvas.getAllByTestId('line-chart-x-label');
    const yLabels = canvas.getAllByTestId('line-chart-y-label');
    
    await expect(xLabels[0]).toHaveTextContent('Sun');
    await expect(yLabels[0]).toHaveTextContent('$100');
  },
};

export const CustomStyles: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
    styles: {
      line: {
        stroke: '#10b981',
        strokeWidth: 3,
      },
      point: {
        fill: '#059669',
        radius: 6,
      },
      axis: {
        stroke: '#6b7280',
        strokeWidth: 2,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check custom line style
    const line = canvas.getByTestId('line-chart-svg').querySelector('path');
    await expect(line).toHaveAttribute('stroke', '#10b981');
    await expect(line).toHaveAttribute('stroke-width', '3');
    
    // Check custom point style
    const point = canvas.getAllByTestId('line-chart-point')[0];
    await expect(point).toHaveAttribute('fill', '#059669');
    await expect(point).toHaveAttribute('r', '6');
    
    // Check custom axis style
    const axis = canvas.getByTestId('line-chart-svg').querySelector('line');
    await expect(axis).toHaveAttribute('stroke', '#6b7280');
    await expect(axis).toHaveAttribute('stroke-width', '2');
  },
};

export const Accessibility: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
    ariaLabel: 'Revenue trend over time',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check chart accessibility
    const chart = canvas.getByTestId('line-chart');
    await expect(chart).toHaveAttribute('role', 'img');
    await expect(chart).toHaveAttribute('aria-label', 'Revenue trend over time');
    
    // Check point accessibility
    const point = canvas.getAllByTestId('line-chart-point')[0];
    await expect(point).toHaveAttribute('role', 'button');
    await expect(point).toHaveAttribute('aria-label', expect.stringContaining('Data point for'));
  },
};
