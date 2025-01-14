import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { FormManager } from '../FormManager';
import { z } from 'zod';
describe('FormManager', () => {
    const schema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email format'),
        age: z.number().min(18, 'Must be at least 18 years old'),
    });
    const initialValues = {
        name: '',
        email: '',
        age: 0,
    };
    let onSubmit;
    let formManager;
    beforeEach(() => {
        onSubmit = jest.fn(() => Promise.resolve());
        formManager = new FormManager({
            initialValues,
            validationSchema: schema,
            onSubmit: onSubmit,
        });
    });
    describe('Initialization', () => {
        it('should initialize with correct initial state', () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            expect(subscriber).toHaveBeenCalledWith({
                values: initialValues,
                errors: {},
                touched: {},
                isSubmitting: false,
                isValid: true,
                isDirty: false,
            });
        });
        it('should handle form without validation schema', () => {
            const simpleForm = new FormManager({
                initialValues,
                onSubmit: jest.fn(() => Promise.resolve()),
            });
            const subscriber = jest.fn();
            simpleForm.subscribe(subscriber);
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                isValid: true,
                errors: {},
            }));
        });
    });
    describe('Subscription Management', () => {
        it('should handle multiple subscribers', () => {
            const subscriber1 = jest.fn();
            const subscriber2 = jest.fn();
            formManager.subscribe(subscriber1);
            formManager.subscribe(subscriber2);
            formManager.handleChange('name', 'John');
            expect(subscriber1).toHaveBeenCalled();
            expect(subscriber2).toHaveBeenCalled();
        });
        it('should allow unsubscribing', () => {
            const subscriber = jest.fn();
            const unsubscribe = formManager.subscribe(subscriber);
            formManager.handleChange('name', 'John');
            expect(subscriber).toHaveBeenCalledTimes(2);
            unsubscribe();
            formManager.handleChange('name', 'Jane');
            expect(subscriber).toHaveBeenCalledTimes(2);
        });
    });
    describe('Field Validation', () => {
        it('should validate single field', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            await formManager.validateField('name');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    name: expect.stringContaining('at least 2 characters'),
                }),
            }));
        });
        it('should clear field error when valid', async () => {
            formManager.handleChange('name', 'Jo');
            await formManager.validateField('name');
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('name', 'John');
            await formManager.validateField('name');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    name: undefined,
                }),
            }));
        });
        it('should validate email format', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('email', 'invalid-email');
            await formManager.validateField('email');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    email: 'Invalid email format',
                }),
            }));
        });
        it('should validate number fields', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('age', 16);
            await formManager.validateField('age');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    age: expect.stringContaining('at least 18'),
                }),
            }));
        });
    });
    describe('Form Validation', () => {
        it('should validate all fields', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            await formManager.validateForm();
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                isValid: false,
                errors: expect.objectContaining({
                    name: expect.any(String),
                    email: expect.any(String),
                    age: expect.any(String),
                }),
            }));
        });
        it('should pass validation with valid data', async () => {
            formManager.handleChange('name', 'John Doe');
            formManager.handleChange('email', 'john@example.com');
            formManager.handleChange('age', 25);
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            const isValid = await formManager.validateForm();
            expect(isValid).toBe(true);
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                isValid: true,
                errors: {},
            }));
        });
    });
    describe('Change Handling', () => {
        it('should update values and mark form as dirty', () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('name', 'John');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                values: expect.objectContaining({
                    name: 'John',
                }),
                isDirty: true,
            }));
        });
        it('should validate on change', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('email', 'invalid');
            // Wait for async validation
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    email: expect.any(String),
                }),
            }));
        });
    });
    describe('Blur Handling', () => {
        it('should mark field as touched', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleBlur('name');
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                touched: expect.objectContaining({
                    name: true,
                }),
            }));
        });
        it('should validate on blur', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.handleChange('email', 'invalid');
            formManager.handleBlur('email');
            // Wait for async validation
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.objectContaining({
                    email: expect.any(String),
                }),
            }));
        });
    });
    describe('Submit Handling', () => {
        it('should prevent submission with validation errors', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            await formManager.handleSubmit();
            expect(onSubmit).not.toHaveBeenCalled();
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                isValid: false,
                errors: expect.any(Object),
            }));
        });
        it('should handle successful submission', async () => {
            formManager.handleChange('name', 'John Doe');
            formManager.handleChange('email', 'john@example.com');
            formManager.handleChange('age', 25);
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            const mockEvent = {
                preventDefault: jest.fn(),
            };
            await formManager.handleSubmit(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                age: 25,
            });
        });
        it('should handle submission lifecycle', async () => {
            formManager.handleChange('name', 'John Doe');
            formManager.handleChange('email', 'john@example.com');
            formManager.handleChange('age', 25);
            const states = [];
            formManager.subscribe(state => states.push({ ...state }));
            await formManager.handleSubmit();
            expect(states).toContainEqual(expect.objectContaining({
                isSubmitting: true,
            }));
            expect(states[states.length - 1]).toEqual(expect.objectContaining({
                isSubmitting: false,
            }));
        });
        it('should handle submission errors', async () => {
            formManager.handleChange('name', 'John Doe');
            formManager.handleChange('email', 'john@example.com');
            formManager.handleChange('age', 25);
            onSubmit.mockImplementationOnce(() => Promise.reject(new Error('Submission failed')));
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            await formManager.handleSubmit();
            expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
                isSubmitting: false,
            }));
        });
    });
    describe('Form Reset', () => {
        it('should reset form to initial state', () => {
            formManager.handleChange('name', 'John');
            formManager.handleChange('email', 'john@example.com');
            formManager.handleBlur('name');
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.reset();
            expect(subscriber).toHaveBeenCalledWith({
                values: initialValues,
                errors: {},
                touched: {},
                isSubmitting: false,
                isValid: true,
                isDirty: false,
            });
        });
        it('should maintain subscriptions after reset', () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            formManager.reset();
            formManager.handleChange('name', 'John');
            expect(subscriber).toHaveBeenCalledTimes(3);
        });
    });
    describe('Complex Scenarios', () => {
        it('should handle multiple field updates and validations', async () => {
            const states = [];
            formManager.subscribe(state => states.push({ ...state }));
            formManager.handleChange('name', 'J');
            await formManager.validateField('name');
            formManager.handleChange('name', 'John');
            await formManager.validateField('name');
            formManager.handleChange('email', 'invalid');
            await formManager.validateField('email');
            formManager.handleChange('email', 'john@example.com');
            await formManager.validateField('email');
            expect(states).toContainEqual(expect.objectContaining({
                errors: expect.objectContaining({
                    name: expect.any(String),
                }),
            }));
            expect(states).toContainEqual(expect.objectContaining({
                errors: expect.objectContaining({
                    email: expect.any(String),
                }),
            }));
            expect(states[states.length - 1]).toEqual(expect.objectContaining({
                errors: {},
                isValid: true,
            }));
        });
        it('should handle rapid state updates', async () => {
            const subscriber = jest.fn();
            formManager.subscribe(subscriber);
            // Simulate rapid typing
            for (const char of 'John Doe') {
                formManager.handleChange('name', char);
            }
            // Wait for all validations to complete
            await new Promise(resolve => setTimeout(resolve, 0));
            const finalCall = subscriber.mock.calls[subscriber.mock.calls.length - 1][0];
            expect(finalCall.values.name).toBe('e');
            expect(finalCall.isDirty).toBe(true);
        });
    });
});
//# sourceMappingURL=FormManager.test.js.map