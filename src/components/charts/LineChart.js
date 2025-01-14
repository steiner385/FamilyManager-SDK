import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
export const LineChart = ({ data, size = { width: 400, height: 300 }, styles = {}, formatters = {}, ariaLabel = "Line chart", 'data-testid': dataTestId, }) => {
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState(null);
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const chartWidth = size.width - margin.left - margin.right;
    const chartHeight = size.height - margin.top - margin.bottom;
    if (data.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center", style: { width: size.width, height: size.height }, "data-testid": dataTestId ? `${dataTestId}-empty` : 'line-chart-empty', children: _jsx("p", { children: "No data available" }) }));
    }
    // Scale data points to chart dimensions
    const xScale = (index) => {
        const min = 0;
        const max = data.length - 1;
        return margin.left + (index - min) * (chartWidth / (max - min));
    };
    const yScale = (value) => {
        const min = Math.min(...data.map(d => d.value));
        const max = Math.max(...data.map(d => d.value));
        return margin.top + chartHeight - (value - min) * (chartHeight / (max - min));
    };
    // Format data points
    const formatTimestamp = formatters.timestamp || ((value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    });
    const formatValue = formatters.value || ((value) => value.toString());
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
    const handlePointHover = (point, event) => {
        setTooltipData(point);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };
    const handlePointLeave = () => {
        setTooltipData(null);
        setTooltipPosition(null);
    };
    return (_jsxs("div", { className: "relative", role: "img", "aria-label": ariaLabel, "data-testid": dataTestId || 'line-chart', children: [_jsxs("svg", { width: size.width, height: size.height, className: "overflow-visible", "data-testid": dataTestId ? `${dataTestId}-svg` : 'line-chart-svg', children: [_jsx("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: size.height - margin.bottom, stroke: axisStyles.stroke, strokeWidth: axisStyles.strokeWidth, "data-testid": dataTestId ? `${dataTestId}-axis` : 'line-chart-axis' }), _jsx("line", { x1: margin.left, y1: size.height - margin.bottom, x2: size.width - margin.right, y2: size.height - margin.bottom, stroke: axisStyles.stroke, strokeWidth: axisStyles.strokeWidth, "data-testid": dataTestId ? `${dataTestId}-axis` : 'line-chart-axis' }), _jsx("path", { d: linePath, fill: "none", stroke: lineStyles.stroke, strokeWidth: lineStyles.strokeWidth, "data-testid": dataTestId ? `${dataTestId}-line` : 'line-chart-line' }), data.map((point, index) => (_jsx("circle", { cx: xScale(index), cy: yScale(point.value), r: pointStyles.radius, fill: pointStyles.fill, role: "button", "aria-label": `Data point for ${formatTimestamp(point.timestamp)}: ${point.value}`, "data-testid": dataTestId ? `${dataTestId}-point` : 'line-chart-point', onMouseEnter: (e) => handlePointHover(point, e), onMouseLeave: handlePointLeave }, index))), data.map((point, index) => (_jsxs(React.Fragment, { children: [_jsx("text", { x: xScale(index), y: size.height - margin.bottom + 20, textAnchor: "middle", className: "text-sm fill-gray-600", "data-testid": dataTestId ? `${dataTestId}-x-label` : 'line-chart-x-label', children: formatTimestamp(point.timestamp) }), _jsx("text", { x: margin.left - 20, y: yScale(point.value), textAnchor: "end", alignmentBaseline: "middle", className: "text-sm fill-gray-600", "data-testid": dataTestId ? `${dataTestId}-y-label` : 'line-chart-y-label', children: formatValue(point.value) })] }, `labels-${index}`)))] }), tooltipData && tooltipPosition && (_jsxs("div", { className: "absolute bg-white shadow-lg rounded p-2 text-sm", style: {
                    left: tooltipPosition.x + 10,
                    top: tooltipPosition.y - 10,
                    transform: 'translate(-50%, -100%)'
                }, "data-testid": dataTestId ? `${dataTestId}-tooltip` : 'line-chart-tooltip', children: [_jsx("div", { children: formatTimestamp(tooltipData.timestamp) }), _jsx("div", { children: formatValue(tooltipData.value) })] }))] }));
};
//# sourceMappingURL=LineChart.js.map