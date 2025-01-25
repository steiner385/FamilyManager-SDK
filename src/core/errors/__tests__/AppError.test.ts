import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
} from '../AppError';

describe('AppError', () => {
  it('should create base AppError with default values', () => {
    const error = new AppError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('AppError');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.details).toBeUndefined();
    expect(error.stack).toBeDefined();
  });

  it('should create AppError with custom values', () => {
    const details = { field: 'test', reason: 'invalid' };
    const error = new AppError('Custom error', 418, 'TEAPOT_ERROR', details);

    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(418);
    expect(error.code).toBe('TEAPOT_ERROR');
    expect(error.details).toEqual(details);
  });

  it('should maintain proper stack trace', () => {
    const error = new AppError('Test error');
    expect(error.stack).toContain('AppError.test.ts');
  });

  describe('ValidationError', () => {
    it('should create ValidationError with default values', () => {
      const error = new ValidationError('Invalid input');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toBeUndefined();
    });

    it('should create ValidationError with details', () => {
      const details = {
        fields: {
          email: 'Invalid email format',
          age: 'Must be a positive number'
        }
      };
      const error = new ValidationError('Validation failed', details);

      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual(details);
    });
  });

  describe('AuthenticationError', () => {
    it('should create AuthenticationError with default message', () => {
      const error = new AuthenticationError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Not authenticated');
      expect(error.name).toBe('AuthenticationError');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should create AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid token');

      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('AuthorizationError', () => {
    it('should create AuthorizationError with default message', () => {
      const error = new AuthorizationError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(error.message).toBe('Not authorized');
      expect(error.name).toBe('AuthorizationError');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
    });

    it('should create AuthorizationError with custom message', () => {
      const error = new AuthorizationError('Insufficient permissions');

      expect(error.message).toBe('Insufficient permissions');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('NotFoundError', () => {
    it('should create NotFoundError', () => {
      const error = new NotFoundError('User not found');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('Error inheritance', () => {
    it('should properly chain error prototypes', () => {
      const error = new ValidationError('Test error');

      expect(Object.getPrototypeOf(error)).toBe(ValidationError.prototype);
      expect(Object.getPrototypeOf(ValidationError.prototype)).toBe(AppError.prototype);
      expect(Object.getPrototypeOf(AppError.prototype)).toEqual(Error.prototype);
    });

    it('should work with instanceof checks', () => {
      const errors = [
        new ValidationError('Invalid'),
        new AuthenticationError('Unauthenticated'),
        new AuthorizationError('Unauthorized'),
        new NotFoundError('Missing')
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
      });
    });
  });

  describe('Complex error scenarios', () => {
    it('should handle nested error details', () => {
      const details = {
        validation: {
          user: {
            profile: {
              age: 'Must be over 18',
              email: 'Invalid format'
            }
          },
          preferences: {
            theme: 'Invalid choice'
          }
        },
        context: {
          requestId: '123',
          timestamp: new Date().toISOString()
        }
      };

      const error = new ValidationError('Complex validation error', details);
      expect(error.details).toEqual(details);
    });

    it('should handle array details', () => {
      const details = {
        errors: [
          { field: 'name', message: 'Too short' },
          { field: 'email', message: 'Invalid format' },
          { field: 'age', message: 'Must be positive' }
        ]
      };

      const error = new ValidationError('Multiple validation errors', details);
      expect(error.details.errors).toHaveLength(3);
      expect(error.details.errors[0].field).toBe('name');
    });

    it('should handle error serialization', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR', { key: 'value' });
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);

      expect(parsed.message).toBe('Test error');
      expect(parsed.statusCode).toBe(500);
      expect(parsed.code).toBe('TEST_ERROR');
      expect(parsed.details).toEqual({ key: 'value' });
    });
  });
});
