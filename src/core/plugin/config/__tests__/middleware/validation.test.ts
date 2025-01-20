import { createValidationMiddleware } from '../../middleware/validation';
import { ConfigError } from '../../errors';
import { ConfigValidator, ConfigValidationResult } from '../../validation';
import { PluginConfig } from '../../types';
import { NextFunction, MiddlewareContext } from '../../middleware/types';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Validation Middleware', () => {
  let mockValidator: jest.Mocked<ConfigValidator>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let config: PluginConfig;
  let schema: Record<string, any>;
  let context: MiddlewareContext;

  beforeEach(() => {
    mockValidator = {
      validate: jest.fn()
    };

    mockNext = jest.fn();
    
    config = {
      metadata: {
        name: 'test-plugin',
        version: '1.0.0'
      },
      settings: {
        enabled: true
      }
    };

    schema = {
      type: 'object',
      properties: {
        metadata: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' }
          }
        },
        settings: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' }
          }
        }
      }
    };

    context = {
      pluginName: 'test-plugin',
      environment: 'test',
      timestamp: Date.now()
    };
  });

  it('should pass valid configuration through', async () => {
    const validResult: ConfigValidationResult = {
      isValid: true,
      errors: []
    };
    mockValidator.validate.mockReturnValue(validResult);
    const middleware = createValidationMiddleware(mockValidator, schema);

    await middleware(config, mockNext, context);

    expect(mockValidator.validate).toHaveBeenCalledWith(config, schema);
    expect(mockNext).toHaveBeenCalledWith(config);
  });

  it('should throw ConfigError for invalid configuration', async () => {
    const invalidResult: ConfigValidationResult = {
      isValid: false,
      errors: [{
        path: ['settings', 'enabled'],
        message: 'must be boolean',
        code: 'INVALID_TYPE'
      }]
    };
    mockValidator.validate.mockReturnValue(invalidResult);
    const middleware = createValidationMiddleware(mockValidator, schema);

    await expect(middleware(config, mockNext, context))
      .rejects
      .toThrow(ConfigError);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
