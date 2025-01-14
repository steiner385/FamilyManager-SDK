import { screen, fireEvent, waitFor, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import './types.d.ts';
export { screen, fireEvent, waitFor, userEvent };
export { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
export declare const render: (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) => RenderResult;
export declare const createModuleTestBed: (moduleName: string) => {
    initialize: () => Promise<void>;
    getState: () => {};
    dispatch: (action: any) => void;
    cleanup: () => void;
};
export declare const createStateTestBed: (moduleName: string) => {
    getState: () => {};
    dispatch: (action: any) => void;
    subscribe: (listener: () => void) => () => void;
};
export declare const mockEventEmitter: () => {
    on: (event: string, handler: (data: any) => void) => void;
    off: (event: string, handler: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
    clear: () => void;
};
export declare const createMockData: {
    timestamp: (date: string) => number;
    user: (overrides?: {}) => {
        id: string;
        name: string;
        email: string;
    };
    event: (overrides?: {}) => {
        id: string;
        title: string;
        timestamp: number;
    };
};
export declare const waitForLoadingToFinish: () => Promise<void>;
export declare const findByTestId: (testId: string) => Promise<HTMLElement>;
export declare const queryByTestId: (testId: string) => HTMLElement | null;
export declare const getByTestId: (testId: string) => HTMLElement;
//# sourceMappingURL=index.d.ts.map