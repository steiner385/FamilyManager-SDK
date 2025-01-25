/**
 * Testing utilities for working with dates
 */
/**
 * Generate a date that is a specified number of days in the future
 */
export declare function addDays(date: Date, days: number): Date;
/**
 * Generate a date that is a specified number of days in the past
 */
export declare function subtractDays(date: Date, days: number): Date;
/**
 * Check if two dates are the same day (ignoring time)
 */
export declare function isSameDay(date1: Date, date2: Date): boolean;
/**
 * Format a date as YYYY-MM-DD
 */
export declare function formatDate(date: Date): string;
/**
 * Format a date as YYYY-MM-DD HH:mm:ss
 */
export declare function formatDateTime(date: Date): string;
/**
 * Parse a date string in YYYY-MM-DD format
 */
export declare function parseDate(dateString: string): Date;
/**
 * Get start of day for a given date
 */
export declare function startOfDay(date: Date): Date;
/**
 * Get end of day for a given date
 */
export declare function endOfDay(date: Date): Date;
/**
 * Get start of week for a given date (Sunday)
 */
export declare function getStartOfWeek(date: Date): Date;
/**
 * Get end of week for a given date (Saturday)
 */
export declare function getEndOfWeek(date: Date): Date;
/**
 * Get start of month for a given date
 */
export declare function getStartOfMonth(date: Date): Date;
/**
 * Get end of month for a given date
 */
export declare function getEndOfMonth(date: Date): Date;
/**
 * Check if a date is valid
 */
export declare function isValidDate(date: Date): boolean;
/**
 * Create a delay promise
 */
export declare function delay(ms: number): Promise<void>;
//# sourceMappingURL=date-utils.d.ts.map