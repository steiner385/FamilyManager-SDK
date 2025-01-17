/**
 * Generate a random date between two dates
 */
export declare function generateRandomDate(start: Date, end: Date): Date;
/**
 * Generate a random date in the future
 */
export declare function generateRandomDateInFuture(maxDays?: number): Date;
/**
 * Generate a random date in the past
 */
export declare function generateRandomDateInPast(maxDays?: number): Date;
/**
 * Generate a random email address
 */
export declare function generateRandomEmail(): string;
/**
 * Generate a random string of specified length
 */
export declare function generateRandomString(length?: number): string;
/**
 * Generate a random number between min and max (inclusive)
 */
export declare function generateRandomNumber(min: number, max: number): number;
/**
 * Generate a random boolean
 */
export declare function generateRandomBoolean(): boolean;
/**
 * Generate a random array of items
 */
export declare function generateRandomArray<T>(generator: () => T, length?: number): T[];
/**
 * Generate a random subset of an array
 */
export declare function generateRandomSubset<T>(array: T[], minSize?: number): T[];
//# sourceMappingURL=generators.d.ts.map