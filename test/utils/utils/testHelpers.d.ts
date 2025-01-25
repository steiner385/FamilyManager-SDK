import { ComponentType } from 'react';
import { Plugin } from '../../plugin/types';
import type { Theme } from '../../../types/base';
interface MockPluginOptions {
    name: string;
    version: string;
    description?: string;
    components?: Record<string, ComponentType>;
    theme?: Partial<Theme>;
    dependencies?: string[];
}
export declare function createMockPlugin(options: MockPluginOptions): Plugin;
export {};
//# sourceMappingURL=testHelpers.d.ts.map