import { BaseError } from '../BaseError';
import { AppError } from '../AppError';
// Concrete implementation of BaseError for testing
class TestError extends BaseError {
    constructor(params) {
        super(params);
    }
}
describe('BaseError', () => {
    it('should set all properties correctly', () => {
        const error = new TestError({
            code: 'TEST_ERROR',
            message: 'Test message',
            statusCode: 418,
            details: { foo: 'bar' },
            source: 'test',
            cause: new Error('Original error')
        });
        expect(error.code).toBe('TEST_ERROR');
        expect(error.message).toBe('Test message');
        expect(error.statusCode).toBe(418);
        expect(error.details).toEqual({ foo: 'bar' });
        expect(error.source).toBe('test');
        expect(error.cause).toBeInstanceOf(Error);
        expect(error.name).toBe('TestError');
        expect(error.stack).toBeDefined();
    });
    it('should use default status code based on error code', () => {
        const error = new TestError({
            code: 'NOT_FOUND',
            message: 'Not found'
        });
        expect(error.statusCode).toBe(404);
    });
    it('should use 500 for unknown error codes', () => {
        const error = new TestError({
            code: 'UNKNOWN_CODE',
            message: 'Unknown'
        });
        expect(error.statusCode).toBe(500);
    });
    it('should serialize to JSON correctly', () => {
        const error = new TestError({
            code: 'TEST_ERROR',
            message: 'Test message',
            details: { foo: 'bar' }
        });
        const json = error.toJSON();
        expect(json).toEqual({
            name: 'TestError',
            code: 'TEST_ERROR',
            message: 'Test message',
            statusCode: 500,
            details: { foo: 'bar' },
            source: undefined,
            cause: undefined
        });
    });
});
describe('AppError', () => {
    it('should extend BaseError', () => {
        const error = new AppError({
            code: 'TEST_ERROR',
            message: 'Test message'
        });
        expect(error).toBeInstanceOf(BaseError);
    });
    it('should use custom status code mappings', () => {
        const error = new AppError({
            code: 'PLUGIN_ERROR',
            message: 'Plugin error'
        });
        expect(error.statusCode).toBe(500);
        const validationError = new AppError({
            code: 'INVALID_RECURRENCE',
            message: 'Invalid recurrence'
        });
        expect(validationError.statusCode).toBe(400);
    });
    it('should override status code from mapping with explicit status code', () => {
        const error = new AppError({
            code: 'NOT_FOUND',
            message: 'Not found',
            statusCode: 500
        });
        expect(error.statusCode).toBe(500);
    });
    it('should correctly identify AppError instances', () => {
        const appError = new AppError({
            code: 'TEST_ERROR',
            message: 'Test message'
        });
        const baseError = new TestError({
            code: 'TEST_ERROR',
            message: 'Test message'
        });
        const standardError = new Error('Standard error');
        expect(AppError.isAppError(appError)).toBe(true);
        expect(AppError.isAppError(baseError)).toBe(false);
        expect(AppError.isAppError(standardError)).toBe(false);
        expect(AppError.isAppError(null)).toBe(false);
        expect(AppError.isAppError(undefined)).toBe(false);
    });
});
//# sourceMappingURL=errors.test.js.map