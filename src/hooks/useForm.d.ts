import type { z } from 'zod';
interface UseFormConfig<T> {
    initialValues: T;
    validationSchema?: z.ZodSchema<T>;
    onSubmit: (values: T) => Promise<void> | void;
}
export declare function useForm<T extends Record<string, any>>(config: UseFormConfig<T>): {
    values: T;
    errors: {};
    touched: {};
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
    handleChange: (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleBlur: (name: keyof T) => () => Promise<void>;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    reset: () => void;
};
export {};
//# sourceMappingURL=useForm.d.ts.map