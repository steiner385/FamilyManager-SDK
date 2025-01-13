import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { RenderResult } from '@testing-library/react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => rtlRender(ui, options);

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
