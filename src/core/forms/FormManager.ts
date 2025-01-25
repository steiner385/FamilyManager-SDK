import { z } from 'zod'

interface FormConfig<T> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  onSubmit: (values: T) => Promise<void> | void
}

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

export class FormManager<T extends Record<string, any>> {
  private config: FormConfig<T>
  private state: FormState<T>
  private subscribers: Set<(state: FormState<T>) => void>

  constructor(config: FormConfig<T>) {
    this.config = config
    this.state = {
      values: { ...config.initialValues },
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    }
    this.subscribers = new Set()
  }

  private notify(force = false) {
    const stateCopy = { ...this.state }
    this.subscribers.forEach(subscriber => subscriber(stateCopy))
  }

  subscribe(callback: (state: FormState<T>) => void) {
    this.subscribers.add(callback)
    callback({ ...this.state }) // Initial notification
    return () => {
      this.subscribers.delete(callback)
      return true
    }
  }

  private async validateState() {
    if (!this.config.validationSchema) {
      this.state = {
        ...this.state,
        isValid: true,
        errors: {}
      }
      return true
    }

    try {
      await this.config.validationSchema.parseAsync(this.state.values)
      this.state = {
        ...this.state,
        isValid: true,
        errors: {}
      }
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof T] = err.message
          }
        })
        this.state = {
          ...this.state,
          isValid: false,
          errors: newErrors
        }
      }
      return false
    }
  }

  async validateField(name: keyof T) {
    if (!this.config.validationSchema) {
      return true
    }

    try {
      await this.config.validationSchema.parseAsync(this.state.values)
      // Form is valid, update state
      this.state = {
        ...this.state,
        errors: {
          ...this.state.errors,
          [name]: undefined
        },
        isValid: true
      }
      this.notify()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => 
          Array.isArray(e.path) && e.path[0] === name
        )
        
        // Update state with field error if present
        this.state = {
          ...this.state,
          errors: {
            ...this.state.errors,
            [name]: fieldError?.message
          },
          isValid: !fieldError
        }
        this.notify()
        return !fieldError
      }
      return true
    }
  }

  async validateForm() {
    const isValid = await this.validateState()
    this.notify(true)
    return isValid
  }

  async handleChange(name: keyof T, value: any) {
    const prevValue = this.state.values[name]
    if (prevValue === value) return

    // Update values and mark as dirty
    this.state = {
      ...this.state,
      values: {
        ...this.state.values,
        [name]: value
      },
      isDirty: true
    }

    // Notify for value change
    this.notify()

    // Then validate if needed
    if (this.config.validationSchema) {
      await this.validateField(name)
    } else {
      // If no validation schema, mark as valid
      this.state = {
        ...this.state,
        isValid: true,
        errors: {}
      }
      this.notify()
    }
  }

  async handleBlur(name: keyof T) {
    // Update touched state
    this.state = {
      ...this.state,
      touched: {
        ...this.state.touched,
        [name]: true
      }
    }

    // Notify for touched state
    this.notify()

    // Then validate
    const isValid = await this.validateField(name)
    if (!isValid) {
      this.notify() // Notify again if validation failed
    }
  }

  async handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()

    try {
      this.state.isSubmitting = true
      this.notify()

      const isValid = await this.validateForm()
      if (!isValid) {
        return
      }

      await this.config.onSubmit(this.state.values)
    } catch (error) {
      this.state.errors = {
        ...this.state.errors,
        submit: error instanceof Error ? error.message : 'Submission failed'
      }
      this.state.isValid = false
    } finally {
      this.state.isSubmitting = false
      this.notify()
    }
  }

  reset() {
    const newState = {
      values: { ...this.config.initialValues },
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    }
    
    // Force state update and notification on reset
    this.state = newState
    this.notify(true)
  }
}
