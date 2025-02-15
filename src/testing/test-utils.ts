import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import './jest-matchers';

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

type CustomRenderOptions = {
  wrapper?: React.ComponentType;
} & Omit<RenderOptions, 'wrapper'>;

function render(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { wrapper: Wrapper, ...rest } = options;

  if (Wrapper) {
    return rtlRender(ui, { wrapper: Wrapper, ...rest });
  }

  return rtlRender(ui, rest);
}

export { render };