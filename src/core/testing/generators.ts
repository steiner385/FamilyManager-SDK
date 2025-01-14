import { addDays, subtractDays } from './date-utils';

/**
 * Generate a random date between two dates
 */
export function generateRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Generate a random date in the future
 */
export function generateRandomDateInFuture(maxDays: number = 365): Date {
  const now = new Date();
  const future = addDays(now, maxDays);
  return generateRandomDate(now, future);
}

/**
 * Generate a random date in the past
 */
export function generateRandomDateInPast(maxDays: number = 365): Date {
  const now = new Date();
  const past = subtractDays(now, maxDays);
  return generateRandomDate(past, now);
}

/**
 * Generate a random email address
 */
export function generateRandomEmail(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 10) + 5;
  const username = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const domains = ['example.com', 'test.com', 'demo.com', 'sample.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * Generate a random number between min and max (inclusive)
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random boolean
 */
export function generateRandomBoolean(): boolean {
  return Math.random() >= 0.5;
}

/**
 * Generate a random array of items
 */
export function generateRandomArray<T>(generator: () => T, length: number = 5): T[] {
  return Array.from({ length }, generator);
}

/**
 * Generate a random subset of an array
 */
export function generateRandomSubset<T>(array: T[], minSize: number = 1): T[] {
  const size = Math.floor(Math.random() * (array.length - minSize + 1)) + minSize;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
}
