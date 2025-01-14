import React from 'react';
import { 
  render, 
  screen, 
  userEvent,
  describe,
  it,
  expect 
} from '../../../testing';
import { MetricsCard } from '../MetricsCard';

describe('MetricsCard', () => {
  const mockData = {
    title: 'Total Revenue',
    value: 1234.56,
    trend: 'up' as const,
    change: 15.2,
    timeframe: 'vs last month'
  };

  it('renders with data', () => {
    render(<MetricsCard {...mockData} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    expect(screen.getByText('+15.2%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('handles negative change values', () => {
    render(
      <MetricsCard 
        {...mockData} 
        trend="down"
        change={-8.5}
      />
    );

    const changeText = screen.getByText('-8.5%');
    expect(changeText).toBeInTheDocument();
    expect(changeText).toHaveClass('text-red-500');
  });

  it('handles custom formatters', () => {
    const formatters = {
      value: (val: number) => `€${val.toFixed(0)}`,
      change: (val: number) => `${val > 0 ? '↑' : '↓'}${Math.abs(val)}%`
    };

    render(
      <MetricsCard 
        {...mockData}
        formatters={formatters}
      />
    );

    expect(screen.getByText('€1235')).toBeInTheDocument();
    expect(screen.getByText('↑15.2%')).toBeInTheDocument();
  });

  it('handles custom styles', () => {
    const customStyles = {
      card: 'bg-blue-100 p-6',
      title: 'text-blue-800',
      value: 'text-blue-900 text-3xl',
      change: 'text-blue-700',
      timeframe: 'text-blue-600'
    };

    render(
      <MetricsCard 
        {...mockData}
        styles={customStyles}
      />
    );

    const card = screen.getByTestId('metrics-card');
    const title = screen.getByText('Total Revenue');
    const value = screen.getByText('$1,234.56');
    const change = screen.getByText('+15.2%');
    const timeframe = screen.getByText('vs last month');

    expect(card).toHaveClass('bg-blue-100 p-6');
    expect(title).toHaveClass('text-blue-800');
    expect(value).toHaveClass('text-blue-900 text-3xl');
    expect(change).toHaveClass('text-blue-700');
    expect(timeframe).toHaveClass('text-blue-600');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <MetricsCard 
        {...mockData}
        onClick={handleClick}
      />
    );

    const card = screen.getByTestId('metrics-card');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockData);
  });

  it('handles loading state', () => {
    render(
      <MetricsCard 
        {...mockData}
        loading={true}
      />
    );

    expect(screen.getByTestId('metrics-card-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument();
  });

  it('handles error state', () => {
    render(
      <MetricsCard 
        {...mockData}
        error="Failed to load metrics"
      />
    );

    expect(screen.getByText('Failed to load metrics')).toBeInTheDocument();
    expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument();
  });

  it('handles accessibility requirements', () => {
    render(
      <MetricsCard 
        {...mockData}
        ariaLabel="Revenue metrics card"
      />
    );

    const card = screen.getByTestId('metrics-card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-label', 'Revenue metrics card');

    const change = screen.getByText('+15.2%');
    expect(change).toHaveAttribute('aria-label', 'Increased by 15.2 percent vs last month');
  });

  it('handles tooltip display', async () => {
    const tooltipText = 'Total revenue across all channels';
    const user = userEvent.setup();

    render(
      <MetricsCard 
        {...mockData}
        tooltip={tooltipText}
      />
    );

    const tooltipContainer = screen.getByTestId('metrics-card-tooltip');
    await user.hover(tooltipContainer);

    const tooltipContent = screen.getByTestId('metrics-card-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveTextContent(tooltipText);
  });

  it('handles neutral trend', () => {
    render(
      <MetricsCard 
        {...mockData}
        trend="neutral"
        change={0}
      />
    );

    const changeText = screen.getByText('0%');
    expect(changeText).toBeInTheDocument();
    expect(changeText).toHaveClass('text-gray-500');
  });
});
