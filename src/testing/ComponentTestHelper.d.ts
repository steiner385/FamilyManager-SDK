import React from 'react';
import { RenderOptions, RenderResult } from '@testing-library/react';
interface TestWrapperProps {
    children: React.ReactNode;
}
export declare class ComponentTestHelper {
    static testAccessibility(Component: React.ComponentType, props?: {}): Promise<void>;
    static createWrapper(providers: React.ComponentType<TestWrapperProps>[]): React.ComponentType<TestWrapperProps>;
    static renderWithProviders(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult;
}
export {};
//# sourceMappingURL=ComponentTestHelper.d.ts.map