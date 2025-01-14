import { createValidationMiddleware } from '../../middleware/validation';
import { ConfigError } from '../../errors';
describe('Validation Middleware', () => {
    let mockValidator;
    beforeEach(() => {
        mockValidator = {
            validate: jest.fn()
        };
    });
    afterEach(() => {
        mockValidator.validate.mockClear();
        jest.clearAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });
    it('should pass valid configuration through', async () => {
        const config = { test: 'value' };
        mockValidator.validate.mockResolvedValue({ isValid: true, errors: [] });
        const middleware = createValidationMiddleware(mockValidator);
        const next = jest.fn();
        await middleware(config, next);
        expect(next).toHaveBeenCalledWith(config);
        expect(mockValidator.validate).toHaveBeenCalledWith(config);
    });
    it('should throw ConfigError for invalid configuration', async () => {
        const config = { test: 'invalid' };
        const validationErrors = [{ path: ['test'], code: 'INVALID', message: 'Invalid value' }];
        mockValidator.validate.mockResolvedValue({
            isValid: false,
            errors: validationErrors
        });
        const middleware = createValidationMiddleware(mockValidator);
        const next = jest.fn();
        await expect(middleware(config, next))
            .rejects
            .toThrow(ConfigError);
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=validation.test.js.map