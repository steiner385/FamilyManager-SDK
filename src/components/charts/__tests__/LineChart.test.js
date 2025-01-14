import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, userEvent, describe, it, expect, createMockData } from '../../../testing';
import { LineChart } from '../LineChart';
describe('LineChart', () => {
    const mockData = [
        { timestamp: createMockData.timestamp('2024-01-01'), value: 10 },
        { timestamp: createMockData.timestamp('2024-01-02'), value: 20 },
        { timestamp: createMockData.timestamp('2024-01-03'), value: 15 }
    ];
    it('renders with data', () => {
        render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 } }));
        // Chart container should be present
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        // SVG should be rendered
        const svg = screen.getByTestId('line-chart-svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '400');
        expect(svg).toHaveAttribute('height', '300');
    });
    it('renders with custom styles', () => {
        const customStyles = {
            line: {
                stroke: '#ff0000',
                strokeWidth: 2
            },
            point: {
                fill: '#00ff00',
                radius: 4
            },
            axis: {
                stroke: '#0000ff',
                strokeWidth: 1
            }
        };
        render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 }, styles: customStyles }));
        const line = screen.getByTestId('line-chart-line');
        const points = screen.getAllByTestId('line-chart-point');
        const axes = screen.getAllByTestId('line-chart-axis');
        expect(line).toHaveAttribute('stroke', '#ff0000');
        expect(line).toHaveAttribute('stroke-width', '2');
        points.forEach(point => {
            expect(point).toHaveAttribute('fill', '#00ff00');
            expect(point).toHaveAttribute('r', '4');
        });
        axes.forEach(axis => {
            expect(axis).toHaveAttribute('stroke', '#0000ff');
            expect(axis).toHaveAttribute('stroke-width', '1');
        });
    });
    it('handles empty data', () => {
        render(_jsx(LineChart, { data: [], size: { width: 400, height: 300 } }));
        expect(screen.getByTestId('line-chart-empty')).toBeInTheDocument();
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });
    it('handles data updates', () => {
        const { rerender } = render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 } }));
        const newData = [
            ...mockData,
            { timestamp: createMockData.timestamp('2024-01-04'), value: 25 }
        ];
        rerender(_jsx(LineChart, { data: newData, size: { width: 400, height: 300 } }));
        const points = screen.getAllByTestId('line-chart-point');
        expect(points).toHaveLength(4);
    });
    it('handles resize', () => {
        const { rerender } = render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 } }));
        let svg = screen.getByTestId('line-chart-svg');
        expect(svg).toHaveAttribute('width', '400');
        expect(svg).toHaveAttribute('height', '300');
        rerender(_jsx(LineChart, { data: mockData, size: { width: 600, height: 400 } }));
        svg = screen.getByTestId('line-chart-svg');
        expect(svg).toHaveAttribute('width', '600');
        expect(svg).toHaveAttribute('height', '400');
    });
    it('renders tooltips on hover', async () => {
        const user = userEvent.setup();
        render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 } }));
        const points = screen.getAllByTestId('line-chart-point');
        await user.hover(points[0]);
        const tooltip = screen.getByTestId('line-chart-tooltip');
        expect(tooltip).toBeInTheDocument();
        // Use the same date formatting approach as the component
        const expectedDate = new Date(mockData[0].timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        expect(tooltip).toHaveTextContent(expectedDate);
        expect(tooltip).toHaveTextContent('10');
    });
    it('handles custom formatters', () => {
        const formatters = {
            timestamp: (ts) => new Date(ts).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            }),
            value: (val) => `$${val}`
        };
        render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 }, formatters: formatters }));
        const xLabels = screen.getAllByTestId('line-chart-x-label');
        const yLabels = screen.getAllByTestId('line-chart-y-label');
        const expectedDate = new Date(mockData[0].timestamp).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
        expect(xLabels[0]).toHaveTextContent(expectedDate);
        expect(yLabels[0]).toHaveTextContent('$10');
    });
    it('handles accessibility requirements', () => {
        render(_jsx(LineChart, { data: mockData, size: { width: 400, height: 300 }, ariaLabel: "Sample line chart" }));
        const chart = screen.getByTestId('line-chart');
        expect(chart).toHaveAttribute('role', 'img');
        expect(chart).toHaveAttribute('aria-label', 'Sample line chart');
        const points = screen.getAllByTestId('line-chart-point');
        points.forEach((point, index) => {
            const date = new Date(mockData[index].timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            expect(point).toHaveAttribute('role', 'button');
            expect(point).toHaveAttribute('aria-label', `Data point for ${date}: ${mockData[index].value}`);
        });
    });
});
//# sourceMappingURL=LineChart.test.js.map