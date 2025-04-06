import { SyncValidator } from '../SyncEngine';

/**
 * Validation rule type
 */
export type ValidationRule<T> = (data: T) => boolean | string;

/**
 * Default validator implementation
 */
export class DefaultValidator<T extends Record<string, any>> implements SyncValidator<T> {
  private rules: Map<string, ValidationRule<T>> = new Map();
  private requiredFields: string[] = [];

  /**
   * Create a new DefaultValidator
   * 
   * @param requiredFields Optional list of required fields
   */
  constructor(requiredFields: string[] = []) {
    this.requiredFields = requiredFields;
  }

  /**
   * Add a validation rule
   * 
   * @param field The field to validate
   * @param rule The validation rule
   */
  public addRule(field: string, rule: ValidationRule<T>): void {
    this.rules.set(field, rule);
  }

  /**
   * Set required fields
   * 
   * @param fields The required fields
   */
  public setRequiredFields(fields: string[]): void {
    this.requiredFields = fields;
  }

  /**
   * Validate data
   * 
   * @param data The data to validate
   * @returns True if the data is valid
   */
  public async validate(data: T): Promise<boolean> {
    const errors = await this.getValidationErrors(data);
    return errors.length === 0;
  }

  /**
   * Get validation errors
   * 
   * @param data The data to validate
   * @returns The validation errors
   */
  public async getValidationErrors(data: T): Promise<string[]> {
    const errors: string[] = [];

    // Check required fields
    for (const field of this.requiredFields) {
      if (!(field in data) || data[field] === undefined || data[field] === null) {
        errors.push(`Field '${field}' is required`);
      }
    }

    // Apply validation rules
    for (const [field, rule] of this.rules.entries()) {
      if (field in data) {
        const result = rule(data);
        
        if (result === false) {
          errors.push(`Validation failed for field '${field}'`);
        } else if (typeof result === 'string') {
          errors.push(result);
        }
      }
    }

    return errors;
  }

  /**
   * Create a validator for a specific entity type
   * 
   * @param entityType The entity type
   * @param requiredFields The required fields
   * @returns The validator
   */
  public static createForEntityType<T extends Record<string, any>>(
    entityType: string,
    requiredFields: string[] = []
  ): DefaultValidator<T> {
    const validator = new DefaultValidator<T>(requiredFields);

    // Add common validation rules based on entity type
    switch (entityType) {
      case 'tasks':
        validator.addRule('title', (data) => {
          if (!data.title || data.title.trim().length === 0) {
            return 'Task title is required';
          }
          if (data.title.length > 100) {
            return 'Task title must be less than 100 characters';
          }
          return true;
        });

        validator.addRule('dueDate', (data) => {
          if (data.dueDate) {
            const date = new Date(data.dueDate);
            if (isNaN(date.getTime())) {
              return 'Invalid due date format';
            }
          }
          return true;
        });
        break;

      case 'calendar':
        validator.addRule('title', (data) => {
          if (!data.title || data.title.trim().length === 0) {
            return 'Event title is required';
          }
          return true;
        });

        validator.addRule('startDate', (data) => {
          if (!data.startDate) {
            return 'Start date is required';
          }
          const date = new Date(data.startDate);
          if (isNaN(date.getTime())) {
            return 'Invalid start date format';
          }
          return true;
        });

        validator.addRule('endDate', (data) => {
          if (data.endDate) {
            const endDate = new Date(data.endDate);
            if (isNaN(endDate.getTime())) {
              return 'Invalid end date format';
            }
            
            if (data.startDate) {
              const startDate = new Date(data.startDate);
              if (endDate < startDate) {
                return 'End date must be after start date';
              }
            }
          }
          return true;
        });
        break;

      case 'shopping':
        validator.addRule('name', (data) => {
          if (!data.name || data.name.trim().length === 0) {
            return 'Shopping item name is required';
          }
          return true;
        });
        break;

      case 'finance':
        validator.addRule('amount', (data) => {
          if (data.amount === undefined || data.amount === null) {
            return 'Amount is required';
          }
          if (isNaN(Number(data.amount))) {
            return 'Amount must be a number';
          }
          return true;
        });

        validator.addRule('date', (data) => {
          if (!data.date) {
            return 'Date is required';
          }
          const date = new Date(data.date);
          if (isNaN(date.getTime())) {
            return 'Invalid date format';
          }
          return true;
        });
        break;

      case 'recipes':
        validator.addRule('title', (data) => {
          if (!data.title || data.title.trim().length === 0) {
            return 'Recipe title is required';
          }
          return true;
        });

        validator.addRule('ingredients', (data) => {
          if (!data.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
            return 'Recipe must have at least one ingredient';
          }
          return true;
        });
        break;
    }

    return validator;
  }
}