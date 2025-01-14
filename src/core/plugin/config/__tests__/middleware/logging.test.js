import { loggingMiddleware } from '../../middleware/logging';
import { logger } from '../../../../utils/logger';
jest.mock('../../../../utils/logger');
describe('Logging Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should log successful configuration processing', async () => {
        const config = { test: 'value' };
        const next = jest.fn();
        await loggingMiddleware(config, next);
        expect(logger.debug).toHaveBeenCalledWith('Processing configuration', expect.objectContaining({ config }));
        expect(logger.debug).toHaveBeenCalledWith('Configuration processed successfully', expect.objectContaining({ duration: expect.any(Number) }));
        expect(next).toHaveBeenCalledWith(config);
    });
    it('should log configuration processing failures', async () => {
        const config = { test: 'value' };
        const error = new Error('Test error');
        const next = jest.fn().mockRejectedValue(error);
        await expect(loggingMiddleware(config, next)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Configuration processing failed', expect.objectContaining({
            error,
            duration: expect.any(Number)
        }));
    });
});
//# sourceMappingURL=logging.test.js.map