import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Re-export testing utilities
export {
  render,
  screen,
  within,
  fireEvent,
  userEvent
};

// Export custom testing utilities
export * from './matchers';
