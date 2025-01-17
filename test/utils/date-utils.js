/**
 * Testing utilities for working with dates
 */
/**
 * Generate a date that is a specified number of days in the future
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
/**
 * Generate a date that is a specified number of days in the past
 */
export function subtractDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date) {
    return date.toISOString().split('T')[0];
}
/**
 * Format a date as YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date) {
    return date.toISOString().replace('T', ' ').split('.')[0];
}
/**
 * Parse a date string in YYYY-MM-DD format
 */
export function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}
/**
 * Get start of day for a given date
 */
export function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
/**
 * Get end of day for a given date
 */
export function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
/**
 * Get start of week for a given date (Sunday)
 */
export function getStartOfWeek(date) {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
}
/**
 * Get end of week for a given date (Saturday)
 */
export function getEndOfWeek(date) {
    const result = new Date(date);
    result.setDate(result.getDate() + (6 - result.getDay()));
    result.setHours(23, 59, 59, 999);
    return result;
}
/**
 * Get start of month for a given date
 */
export function getStartOfMonth(date) {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
}
/**
 * Get end of month for a given date
 */
export function getEndOfMonth(date) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
}
/**
 * Check if a date is valid
 */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
/**
 * Create a delay promise
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=date-utils.js.map