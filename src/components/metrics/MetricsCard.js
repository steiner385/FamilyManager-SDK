import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoadingSkeleton } from '../common/LoadingSkeleton';
export const MetricsCard = ({ title, value, trend, change, timeframe, formatters = {}, styles = {}, loading = false, error, tooltip, ariaLabel, onClick, 'data-testid': dataTestId, }) => {
    const defaultStyles = {
        card: `bg-white rounded-lg shadow-sm p-4 ${styles.card || ''}`,
        title: `text-gray-900 text-lg font-bold ${styles.title || ''}`,
        value: `text-gray-900 text-3xl font-bold mt-2 ${styles.value || ''}`,
        change: `${trend === 'up' ? 'text-green-800' : trend === 'down' ? 'text-red-800' : 'text-gray-800'} ${styles.change || ''}`,
        timeframe: `text-gray-700 text-sm ${styles.timeframe || ''}`
    };
    const defaultFormatters = {
        value: (val) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: (val) => `${val > 0 ? '+' : ''}${val}%`
    };
    const formatValue = formatters.value || defaultFormatters.value;
    const formatChange = formatters.change || defaultFormatters.change;
    if (loading) {
        return (_jsx("div", { "data-testid": dataTestId ? `${dataTestId}-skeleton` : 'metrics-card-skeleton', className: defaultStyles.card, children: _jsx(LoadingSkeleton, { className: "h-20" }) }));
    }
    if (error) {
        return (_jsx("div", { "data-testid": dataTestId ? `${dataTestId}-error` : 'metrics-card-error', className: `${defaultStyles.card} text-red-700`, children: error }));
    }
    const handleClick = () => {
        if (onClick) {
            onClick({
                title,
                value,
                trend,
                change,
                timeframe
            });
        }
    };
    const changeLabel = `${trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Changed'} by ${Math.abs(change)} percent ${timeframe}`;
    return (_jsxs("div", { "data-testid": dataTestId || 'metrics-card', className: defaultStyles.card, role: "region", "aria-label": ariaLabel || title, onClick: onClick ? handleClick : undefined, style: { cursor: onClick ? 'pointer' : 'default' }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: defaultStyles.title, "data-testid": dataTestId ? `${dataTestId}-title` : 'metrics-card-title', children: title }), tooltip && (_jsxs("div", { "data-testid": dataTestId ? `${dataTestId}-tooltip` : 'metrics-card-tooltip', className: "relative group", children: [_jsx("svg", { className: "w-4 h-4 text-gray-400 hover:text-gray-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("div", { className: "absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded p-2 -right-2 transform translate-x-full -translate-y-1/2", "data-testid": dataTestId ? `${dataTestId}-tooltip-content` : 'metrics-card-tooltip-content', children: tooltip })] }))] }), _jsx("div", { className: defaultStyles.value, "data-testid": dataTestId ? `${dataTestId}-value` : 'metrics-card-value', children: formatValue(value) }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsx("span", { className: defaultStyles.change, "aria-label": changeLabel, "data-testid": dataTestId ? `${dataTestId}-change` : 'metrics-card-change', children: formatChange(change) }), _jsxs("span", { className: defaultStyles.timeframe, "data-testid": dataTestId ? `${dataTestId}-timeframe` : 'metrics-card-timeframe', children: ["\u00A0", timeframe] })] })] }));
};
//# sourceMappingURL=MetricsCard.js.map