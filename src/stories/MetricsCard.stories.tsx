import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { MetricsCard } from '../components/metrics/MetricsCard';

const meta = {
  title: 'Metrics/MetricsCard',
  component: MetricsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MetricsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: 15000.75,
    trend: 'up',
    change: 12.5,
    timeframe: 'vs last month',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check title
    const title = canvas.getByText('Total Revenue');
    await expect(title).toBeVisible();
    
    // Check formatted value
    const value = canvas.getByText('$15,000.75');
    await expect(value).toBeVisible();
    
    // Check change value and color
    const change = canvas.getByText('+12.5%');
    await expect(change).toBeVisible();
    await expect(change).toHaveClass('text-green-500');
    
    // Check timeframe
    const timeframe = canvas.getByText('vs last month');
    await expect(timeframe).toBeVisible();
    
    // Check accessibility
    const card = canvas.getByRole('region');
    await expect(card).toHaveAttribute('aria-label', 'Total Revenue');
  },
};

export const Loading: Story = {
  args: {
    title: 'Total Revenue',
    value: 0,
    trend: 'neutral',
    change: 0,
    timeframe: '',
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if skeleton is rendered
    const skeleton = canvas.getByTestId('metrics-card-skeleton');
    await expect(skeleton).toBeVisible();
    
    // Verify content is not rendered
    const content = canvas.queryByText('Total Revenue');
    await expect(content).toBeNull();
  },
};

export const Error: Story = {
  args: {
    title: 'Total Revenue',
    value: 0,
    trend: 'neutral',
    change: 0,
    timeframe: '',
    error: 'Failed to load metrics',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if error message is rendered
    const error = canvas.getByText('Failed to load metrics');
    await expect(error).toBeVisible();
    await expect(error.parentElement).toHaveClass('text-red-500');
  },
};

export const WithTooltip: Story = {
  args: {
    title: 'Total Revenue',
    value: 15000.75,
    trend: 'up',
    change: 12.5,
    timeframe: 'vs last month',
    tooltip: 'Total revenue across all channels',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check if info icon is present
    const infoIcon = canvas.getByTestId('metrics-card-info');
    await expect(infoIcon).toBeVisible();
    
    // Hover to show tooltip
    await userEvent.hover(infoIcon);
    
    // Check tooltip content
    const tooltip = canvas.getByText('Total revenue across all channels');
    await expect(tooltip).toBeVisible();
  },
};

export const WithCustomFormatters: Story = {
  args: {
    title: 'Active Users',
    value: 1234,
    trend: 'down',
    change: -5.2,
    timeframe: 'vs last week',
    formatters: {
      value: (val) => val.toLocaleString(),
      change: (val) => `${val > 0 ? '↑' : '↓'} ${Math.abs(val)}%`,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check custom formatted value
    const value = canvas.getByText('1,234');
    await expect(value).toBeVisible();
    
    // Check custom formatted change
    const change = canvas.getByText('↓ 5.2%');
    await expect(change).toBeVisible();
    await expect(change).toHaveClass('text-red-500');
  },
};

export const WithClickHandler: Story = {
  args: {
    title: 'Total Revenue',
    value: 15000.75,
    trend: 'up',
    change: 12.5,
    timeframe: 'vs last month',
    onClick: () => {},
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Check cursor style
    const card = canvas.getByTestId('metrics-card');
    await expect(card).toHaveStyle({ cursor: 'pointer' });
    
    // Click the card
    await userEvent.click(card);
    
    // Verify onClick was called with all required props
    await expect(args.onClick).toHaveBeenCalledWith({
      title: 'Total Revenue',
      value: 15000.75,
      trend: 'up',
      change: 12.5,
      timeframe: 'vs last month',
    });
  },
};

export const TrendColors: Story = {
  args: {
    title: 'Metrics',
    value: 100,
    trend: 'neutral',
    change: 0,
    timeframe: 'vs last period',
  },
  render: (args) => (
    <div className="flex gap-4">
      <MetricsCard {...args} trend="up" change={10} />
      <MetricsCard {...args} trend="down" change={-10} />
      <MetricsCard {...args} trend="neutral" change={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cards = canvas.getAllByTestId('metrics-card');
    
    // Check trend colors
    const [upTrend] = within(cards[0]).getAllByText('+10%');
    const [downTrend] = within(cards[1]).getAllByText('-10%');
    const [neutralTrend] = within(cards[2]).getAllByText('0%');
    
    await expect(upTrend).toHaveClass('text-green-500');
    await expect(downTrend).toHaveClass('text-red-500');
    await expect(neutralTrend).toHaveClass('text-gray-500');
  },
};
