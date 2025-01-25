import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '../components/charts/LineChart';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of data points with timestamp and value',
    },
    size: {
      control: 'object',
      description: 'Width and height of the chart',
    },
    styles: {
      control: 'object',
      description: 'Custom styles for line, points, and axes',
    },
    formatters: {
      control: 'object',
      description: 'Custom formatters for timestamp and value',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label for the chart',
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, value: 10 },
  { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, value: 25 },
  { timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, value: 15 },
  { timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, value: 30 },
  { timestamp: Date.now(), value: 20 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    'data-testid': 'default-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chart = canvas.getByTestId('default-chart');
    const svg = canvas.getByTestId('default-chart-svg');
    const line = canvas.getByTestId('default-chart-line');
    const points = canvas.getAllByTestId('default-chart-point');
    
    await expect(chart).toBeVisible();
    await expect(svg).toBeVisible();
    await expect(line).toBeVisible();
    await expect(points).toHaveLength(5);
  },
};

export const CustomSize: Story = {
  args: {
    data: sampleData,
    size: { width: 600, height: 400 },
    'data-testid': 'custom-size-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByTestId('custom-size-chart-svg');

    await expect(svg).toHaveAttribute('width', '600');
    await expect(svg).toHaveAttribute('height', '400');
  },
};

export const CustomStyles: Story = {
  args: {
    data: sampleData,
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
    'data-testid': 'custom-styles-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const line = canvas.getByTestId('custom-styles-chart-line');
    const points = canvas.getAllByTestId('custom-styles-chart-point');
    const axes = canvas.getAllByTestId('custom-styles-chart-axis');
    
    await expect(line).toHaveAttribute('stroke', '#10b981');
    await expect(line).toHaveAttribute('stroke-width', '3');
    await expect(points[0]).toHaveAttribute('fill', '#059669');
    await expect(points[0]).toHaveAttribute('r', '6');
    await expect(axes[0]).toHaveAttribute('stroke', '#6b7280');
    await expect(axes[0]).toHaveAttribute('stroke-width', '2');
  },
};

export const CustomFormatters: Story = {
  args: {
    data: sampleData,
    formatters: {
      timestamp: (value: number) => new Date(value).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      value: (value: number) => `$${value.toFixed(2)}`,
    },
    'data-testid': 'custom-formatters-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const xLabels = canvas.getAllByTestId('custom-formatters-chart-x-label');
    const yLabels = canvas.getAllByTestId('custom-formatters-chart-y-label');
    
    await expect(xLabels[0]).toBeVisible();
    await expect(yLabels[0]).toBeVisible();
    await expect(yLabels[0].textContent).toContain('$');
  },
};

export const WithTooltip: Story = {
  args: {
    data: sampleData,
    'data-testid': 'tooltip-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const points = canvas.getAllByTestId('tooltip-chart-point');

    // Hover over a point to show tooltip
    await userEvent.hover(points[0]);
    const tooltip = canvas.getByTestId('tooltip-chart-tooltip');
    await expect(tooltip).toBeVisible();

    // Move away to hide tooltip
    await userEvent.unhover(points[0]);
    await expect(canvas.queryByTestId('tooltip-chart-tooltip')).not.toBeInTheDocument();
  },
};

export const EmptyData: Story = {
  args: {
    data: [],
    'data-testid': 'empty-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emptyMessage = canvas.getByTestId('empty-chart-empty');

    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toHaveTextContent('No data available');
  },
};

export const SingleDataPoint: Story = {
  args: {
    data: [{ timestamp: Date.now(), value: 50 }],
    'data-testid': 'single-point-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const points = canvas.getAllByTestId('single-point-chart-point');

    await expect(points).toHaveLength(1);
  },
};

export const LargeDataSet: Story = {
  args: {
    data: Array.from({ length: 20 }, (_, i) => ({
      timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
      value: Math.random() * 100,
    })),
    size: { width: 800, height: 400 },
    'data-testid': 'large-dataset-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const points = canvas.getAllByTestId('large-dataset-chart-point');
    const xLabels = canvas.getAllByTestId('large-dataset-chart-x-label');

    await expect(points).toHaveLength(20);
    await expect(xLabels).toHaveLength(20);
  },
};

export const AccessibleChart: Story = {
  args: {
    data: sampleData,
    ariaLabel: 'Monthly sales data visualization',
    'data-testid': 'accessible-chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chart = canvas.getByTestId('accessible-chart');
    const points = canvas.getAllByTestId('accessible-chart-point');

    await expect(chart).toHaveAttribute('role', 'img');
    await expect(chart).toHaveAttribute('aria-label', 'Monthly sales data visualization');
    await expect(points[0]).toHaveAttribute('role', 'button');
    await expect(points[0]).toHaveAttribute('aria-label');
  },
};
