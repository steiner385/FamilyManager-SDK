import { useState, useEffect } from 'react'
import { FormManager } from '../core/forms/FormManager'
import type { z } from 'zod'

interface UseFormConfig<T> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  onSubmit: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>(config: UseFormConfig<T>) {
  const [formManager] = useState(() => new FormManager(config))
  const [formState, setFormState] = useState(() => ({
    values: config.initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false
  }))

  useEffect(() => {
    return formManager.subscribe(setFormState)
  }, [formManager])

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    handleChange: (name: keyof T) => (
      e: React.ChangeEvent<HTMLInputElement>
    ) => formManager.handleChange(name, e.target.value),
    handleBlur: (name: keyof T) => () => formManager.handleBlur(name),
    handleSubmit: formManager.handleSubmit.bind(formManager),
    reset: formManager.reset.bind(formManager)
  }
}
