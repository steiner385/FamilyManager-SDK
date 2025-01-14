import { jsx as _jsx } from "react/jsx-runtime";
import { LayoutManager } from '../core/layout/LayoutManager';
import { DynamicComponent } from './DynamicComponent';
export function DynamicLayout({ layoutId, className = '' }) {
    const manager = LayoutManager.getInstance();
    const layout = manager.getLayout(layoutId);
    if (!layout) {
        console.warn(`Layout "${layoutId}" not found`);
        return null;
    }
    const gridTemplateAreas = layout.areas
        .map((row) => `"${row.join(' ')}"`)
        .join(' ');
    return (_jsx("div", { className: className, style: {
            display: 'grid',
            gridTemplateAreas,
            gap: '1rem'
        }, children: Object.entries(layout.components).map(([area, config]) => (_jsx("div", { style: { gridArea: area }, children: _jsx(DynamicComponent, { id: config.componentId, props: config.props }) }, area))) }));
}
//# sourceMappingURL=DynamicLayout.js.map