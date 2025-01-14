import { ReactElement } from 'react';
import { RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { RenderResult } from '@testing-library/react';
declare const customRender: (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => RenderResult;
export * from '@testing-library/react';
export { customRender as render };
//# sourceMappingURL=test-utils.d.ts.map