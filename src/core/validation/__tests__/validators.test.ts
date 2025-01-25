import { emailSchema, passwordSchema, userCreateSchema } from '../validators';
import { z } from 'zod';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email formats', () => {
      expect(() => emailSchema.parse('test@example.com')).not.toThrow();
      expect(() => emailSchema.parse('user.name+tag@domain.co.uk')).not.toThrow();
    });

    it('should reject invalid email formats', () => {
      expect(() => emailSchema.parse('invalid')).toThrow('Invalid email format');
      expect(() => emailSchema.parse('test@')).toThrow('Invalid email format');
      expect(() => emailSchema.parse('@domain.com')).toThrow('Invalid email format');
    });
  });

  describe('passwordSchema', () => {
    it('should validate correct password formats', () => {
      expect(() => passwordSchema.parse('Password123')).not.toThrow();
      expect(() => passwordSchema.parse('StrongP@ss1')).not.toThrow();
    });

    it('should reject passwords that are too short', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow('Password must be at least 8 characters');
    });

    it('should reject passwords without uppercase letters', () => {
      expect(() => passwordSchema.parse('password123')).toThrow('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      expect(() => passwordSchema.parse('PasswordOnly')).toThrow('Password must contain at least one number');
    });
  });

  describe('userCreateSchema', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PARENT' as const
    };

    it('should validate correct user data', () => {
      expect(() => userCreateSchema.parse(validUser)).not.toThrow();
    });

    it('should reject missing required fields', () => {
      const invalidUser = { ...validUser };
      delete (invalidUser as any).firstName;
      
      const result = userCreateSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]).toMatchObject({
          code: 'invalid_type',
          path: ['firstName'],
          message: 'Required'
        });
      }
    });

    it('should reject invalid roles', () => {
      const invalidUser = {
        ...validUser,
        role: 'INVALID_ROLE'
      };

      expect(() => userCreateSchema.parse(invalidUser))
        .toThrow(/Invalid enum value/);
    });

    it('should validate all user roles', () => {
      const roles = ['ADMIN', 'PARENT', 'MEMBER', 'CHILD'];
      roles.forEach(role => {
        expect(() => userCreateSchema.parse({ ...validUser, role })).not.toThrow();
      });
    });

    it('should reject empty names', () => {
      expect(() => userCreateSchema.parse({ ...validUser, firstName: '' }))
        .toThrow('First name is required');
      expect(() => userCreateSchema.parse({ ...validUser, lastName: '' }))
        .toThrow('Last name is required');
    });
  });
});
