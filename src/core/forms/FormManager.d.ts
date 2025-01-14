import { z } from 'zod';
interface FormConfig<T> {
    initialValues: T;
    validationSchema?: z.ZodSchema<T>;
    onSubmit: (values: T) => Promise<void> | void;
}
interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
}
export declare class FormManager<T extends Record<string, any>> {
    private config;
    private state;
    private subscribers;
    constructor(config: FormConfig<T>);
    private notify;
    subscribe(callback: (state: FormState<T>) => void): () => boolean;
    private validateState;
    validateField(name: keyof T): Promise<boolean>;
    validateForm(): Promise<boolean>;
    handleChange(name: keyof T, value: any): Promise<void>;
    handleBlur(name: keyof T): Promise<void>;
    handleSubmit(e?: React.FormEvent): Promise<void>;
    reset(): void;
}
export {};
//# sourceMappingURL=FormManager.d.ts.map