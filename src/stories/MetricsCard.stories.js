import { MetricsCard } from '../components/metrics/MetricsCard';
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
const meta = {
    title: 'Metrics/MetricsCard',
    component: MetricsCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Title of the metrics card',
        },
        value: {
            control: 'number',
            description: 'Current value to display',
        },
        trend: {
            control: 'select',
            options: ['up', 'down', 'neutral'],
            description: 'Trend direction for the change',
        },
        change: {
            control: 'number',
            description: 'Percentage change value',
        },
        timeframe: {
            control: 'text',
            description: 'Timeframe for the change',
        },
        loading: {
            control: 'boolean',
            description: 'Loading state of the card',
        },
        error: {
            control: 'text',
            description: 'Error message to display',
        },
        tooltip: {
            control: 'text',
            description: 'Tooltip content',
        },
    },
};
export default meta;
export const Default = {
    args: {
        title: 'Total Revenue',
        value: 150000,
        trend: 'up',
        change: 12.5,
        timeframe: 'vs last month',
        'data-testid': 'default-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('default-metrics');
        const title = canvas.getByTestId('default-metrics-title');
        const value = canvas.getByTestId('default-metrics-value');
        const change = canvas.getByTestId('default-metrics-change');
        const timeframe = canvas.getByTestId('default-metrics-timeframe');
        await expect(card).toBeVisible();
        await expect(title).toHaveTextContent('Total Revenue');
        await expect(value).toHaveTextContent('$150,000.00');
        await expect(change).toHaveTextContent('+12.5%');
        await expect(timeframe).toHaveTextContent('vs last month');
    },
};
export const Loading = {
    args: {
        title: 'Total Revenue',
        value: 0,
        trend: 'neutral',
        change: 0,
        timeframe: '',
        loading: true,
        'data-testid': 'loading-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const skeleton = canvas.getByTestId('loading-metrics-skeleton');
        await expect(skeleton).toBeVisible();
    },
};
export const Error = {
    args: {
        title: 'Total Revenue',
        value: 0,
        trend: 'neutral',
        change: 0,
        timeframe: '',
        error: 'Failed to load metrics data',
        'data-testid': 'error-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const error = canvas.getByTestId('error-metrics-error');
        await expect(error).toBeVisible();
        await expect(error).toHaveTextContent('Failed to load metrics data');
        await expect(error).toHaveClass('text-red-700');
    },
};
export const WithTooltip = {
    args: {
        title: 'Total Revenue',
        value: 150000,
        trend: 'up',
        change: 12.5,
        timeframe: 'vs last month',
        tooltip: 'Total revenue across all channels',
        'data-testid': 'tooltip-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tooltip = canvas.getByTestId('tooltip-metrics-tooltip');
        const tooltipContent = canvas.getByTestId('tooltip-metrics-tooltip-content');
        await expect(tooltip).toBeVisible();
        await expect(tooltipContent).toHaveTextContent('Total revenue across all channels');
    },
};
export const NegativeTrend = {
    args: {
        title: 'Conversion Rate',
        value: 2.5,
        trend: 'down',
        change: -1.2,
        timeframe: 'vs last week',
        formatters: {
            value: (val) => `${val}%`,
            change: (val) => `${val > 0 ? '+' : ''}${val}%`,
        },
        'data-testid': 'negative-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const value = canvas.getByTestId('negative-metrics-value');
        const change = canvas.getByTestId('negative-metrics-change');
        await expect(value).toHaveTextContent('2.5%');
        await expect(change).toHaveTextContent('-1.2%');
        await expect(change).toHaveClass('text-red-800');
    },
};
export const CustomFormatters = {
    args: {
        title: 'Active Users',
        value: 1234567,
        trend: 'up',
        change: 15.8,
        timeframe: 'vs last quarter',
        formatters: {
            value: (val) => val.toLocaleString(),
            change: (val) => `${val > 0 ? '↑' : '↓'} ${Math.abs(val)}%`,
        },
        'data-testid': 'custom-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const value = canvas.getByTestId('custom-metrics-value');
        const change = canvas.getByTestId('custom-metrics-change');
        await expect(value).toHaveTextContent('1,234,567');
        await expect(change).toHaveTextContent('↑ 15.8%');
    },
};
export const Clickable = {
    args: {
        title: 'Total Orders',
        value: 1250,
        trend: 'up',
        change: 8.3,
        timeframe: 'vs last month',
        onClick: () => { },
        'data-testid': 'clickable-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('clickable-metrics');
        await expect(card).toHaveStyle({ cursor: 'pointer' });
        await userEvent.click(card);
    },
};
export const CustomStyles = {
    args: {
        title: 'Revenue',
        value: 75000,
        trend: 'up',
        change: 5.7,
        timeframe: 'vs last month',
        styles: {
            card: 'bg-blue-50',
            title: 'text-blue-800',
            value: 'text-blue-900',
            change: 'font-bold',
            timeframe: 'italic',
        },
        'data-testid': 'styled-metrics',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const card = canvas.getByTestId('styled-metrics');
        const title = canvas.getByTestId('styled-metrics-title');
        const value = canvas.getByTestId('styled-metrics-value');
        await expect(card).toHaveClass('bg-blue-50');
        await expect(title).toHaveClass('text-blue-800');
        await expect(value).toHaveClass('text-blue-900');
    },
};
//# sourceMappingURL=MetricsCard.stories.js.map