interface ApiError extends Error {
    code?: string;
    status?: number;
    data?: unknown;
}
export declare function handleApiError(error: unknown): ApiError;
export declare function isApiError(error: unknown): error is ApiError;
export declare function getErrorMessage(error: unknown): string;
export {};
//# sourceMappingURL=errorHandler.d.ts.map