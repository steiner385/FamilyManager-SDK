import { expect } from '@jest/globals';

/**
 * Custom assertions for testing
 */

/**
 * Assert that a value is defined and not null
 */
export function assertDefined<T>(value: T | undefined | null, message?: string): asserts value is T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
}

/**
 * Assert that a promise rejects with a specific error
 */
export async function assertRejects(promise: Promise<any>, errorType: any, message?: string) {
  try {
    await promise;
    fail('Promise should have rejected');
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(errorType);
    if (message && error instanceof Error) {
      expect(error.message).toContain(message);
    }
  }
}

/**
 * Assert that an array has a specific length
 */
export function assertArrayLength<T>(array: T[], length: number) {
  expect(array).toHaveLength(length);
}

/**
 * Assert that an object has specific properties
 */
export function assertHasProperties(obj: any, properties: string[]) {
  properties.forEach(prop => {
    expect(obj).toHaveProperty(prop);
  });
}

/**
 * Assert that a function throws a specific error
 */
export function assertThrows(fn: () => any, errorType: any, message?: string) {
  expect(() => fn()).toThrow(errorType);
  if (message) {
    expect(() => fn()).toThrow(message);
  }
}

/**
 * Assert that a value matches a type predicate
 */
export function assertType<T>(value: any, predicate: (value: any) => value is T): asserts value is T {
  expect(predicate(value)).toBe(true);
}

/**
 * Assert that an async operation completes within a timeout
 */
export async function assertTimeout(promise: Promise<any>, timeout: number) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeout);
  });
  await expect(Promise.race([promise, timeoutPromise])).resolves.toBeDefined();
}

/**
 * Assert that two dates are equal (ignoring milliseconds)
 */
export function assertDatesEqual(date1: Date, date2: Date) {
  expect(date1.getTime()).toBeCloseTo(date2.getTime(), -3); // -3 precision = ignore milliseconds
}

/**
 * Assert that a value is within a numeric range
 */
export function assertInRange(value: number, min: number, max: number) {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}
