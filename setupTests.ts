// Jest setup file
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Add TextEncoder/TextDecoder to global scope
global.TextEncoder = TextEncoder;
// @ts-ignore - Node's TextDecoder is slightly different from the DOM's but works fine
global.TextDecoder = TextDecoder;

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch API
const createResponse = (body: any): Response => {
  const response = new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return response;
};

global.fetch = jest.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => 
  Promise.resolve(createResponse({}))
) as jest.Mock;

// Mock URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();