import { useState, useEffect } from 'react';
import { FormManager } from '../core/forms/FormManager';
export function useForm(config) {
    const [formManager] = useState(() => new FormManager(config));
    const [formState, setFormState] = useState(() => ({
        values: config.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false
    }));
    useEffect(() => {
        const unsubscribe = formManager.subscribe(setFormState);
        return () => {
            unsubscribe();
        };
    }, [formManager]);
    return {
        values: formState.values,
        errors: formState.errors,
        touched: formState.touched,
        isSubmitting: formState.isSubmitting,
        isValid: formState.isValid,
        isDirty: formState.isDirty,
        handleChange: (name) => (e) => formManager.handleChange(name, e.target.value),
        handleBlur: (name) => () => formManager.handleBlur(name),
        handleSubmit: formManager.handleSubmit.bind(formManager),
        reset: formManager.reset.bind(formManager)
    };
}
//# sourceMappingURL=useForm.js.map