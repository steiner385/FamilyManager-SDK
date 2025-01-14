/**
 * Custom assertions for testing
 */
/**
 * Assert that a value is defined and not null
 */
export declare function assertDefined<T>(value: T | undefined | null, message?: string): asserts value is T;
/**
 * Assert that a promise rejects with a specific error
 */
export declare function assertRejects(promise: Promise<any>, errorType: any, message?: string): Promise<void>;
/**
 * Assert that an array has a specific length
 */
export declare function assertArrayLength<T>(array: T[], length: number): void;
/**
 * Assert that an object has specific properties
 */
export declare function assertHasProperties(obj: any, properties: string[]): void;
/**
 * Assert that a function throws a specific error
 */
export declare function assertThrows(fn: () => any, errorType: any, message?: string): void;
/**
 * Assert that a value matches a type predicate
 */
export declare function assertType<T>(value: any, predicate: (value: any) => value is T): asserts value is T;
/**
 * Assert that an async operation completes within a timeout
 */
export declare function assertTimeout(promise: Promise<any>, timeout: number): Promise<void>;
/**
 * Assert that two dates are equal (ignoring milliseconds)
 */
export declare function assertDatesEqual(date1: Date, date2: Date): void;
/**
 * Assert that a value is within a numeric range
 */
export declare function assertInRange(value: number, min: number, max: number): void;
//# sourceMappingURL=assertions.d.ts.map