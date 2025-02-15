import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';

interface RenderOptions {
  wrapper?: React.ComponentType;
}

function render(ui: React.ReactElement, options: RenderOptions = {}): RenderResult {
  const { wrapper: Wrapper } = options;

  if (Wrapper) {
    return rtlRender(ui, { wrapper: Wrapper });
  }
  return rtlRender(ui);
}

export * from '@testing-library/react';
export { render, screen, waitFor };
