import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';
const customRender = (ui, options) => rtlRender(ui, options);
// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };
//# sourceMappingURL=simple-test-utils.js.map