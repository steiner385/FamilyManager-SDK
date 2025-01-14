import { addDays, subtractDays } from './date-utils';
/**
 * Generate a random date between two dates
 */
export function generateRandomDate(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}
/**
 * Generate a random date in the future
 */
export function generateRandomDateInFuture(maxDays = 365) {
    const now = new Date();
    const future = addDays(now, maxDays);
    return generateRandomDate(now, future);
}
/**
 * Generate a random date in the past
 */
export function generateRandomDateInPast(maxDays = 365) {
    const now = new Date();
    const past = subtractDays(now, maxDays);
    return generateRandomDate(past, now);
}
/**
 * Generate a random email address
 */
export function generateRandomEmail() {
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
export function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
/**
 * Generate a random number between min and max (inclusive)
 */
export function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Generate a random boolean
 */
export function generateRandomBoolean() {
    return Math.random() >= 0.5;
}
/**
 * Generate a random array of items
 */
export function generateRandomArray(generator, length = 5) {
    return Array.from({ length }, generator);
}
/**
 * Generate a random subset of an array
 */
export function generateRandomSubset(array, minSize = 1) {
    const size = Math.floor(Math.random() * (array.length - minSize + 1)) + minSize;
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, size);
}
//# sourceMappingURL=generators.js.map