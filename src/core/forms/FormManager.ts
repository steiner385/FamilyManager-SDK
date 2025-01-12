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
      values: config.initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    }
    this.subscribers = new Set()
    // Notify subscribers of initial state
    this.notify()
  }

  private notify() {
    this.subscribers.forEach(subscriber => subscriber(this.state))
  }

  subscribe(callback: (state: FormState<T>) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  async validateField(name: keyof T) {
    if (!this.config.validationSchema) return

    try {
      await this.config.validationSchema.parseAsync({
        ...this.state.values,
        [name]: this.state.values[name]
      })
      // Create new errors object to ensure state update
      this.state.errors = {
        ...this.state.errors,
        [name]: undefined
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path[0] === name)
        // Create new errors object to ensure state update
        this.state.errors = {
          ...this.state.errors,
          [name]: fieldError ? fieldError.message : undefined
        }
      }
    }

    // Update isValid based on current errors
    this.state.isValid = Object.values(this.state.errors).every(error => !error)
    this.notify()
  }

  async validateForm() {
    if (!this.config.validationSchema) return true

    try {
      await this.config.validationSchema.parseAsync(this.state.values)
      this.state.errors = {}
      this.state.isValid = true
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.state.errors = error.errors.reduce((acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message
        }), {})
        this.state.isValid = false
      }
      return false
    } finally {
      this.notify()
    }
  }

  handleChange(name: keyof T, value: any) {
    this.state.values[name] = value
    this.state.isDirty = true
    this.validateField(name)
    this.notify()
  }

  handleBlur(name: keyof T) {
    this.state.touched[name] = true
    this.validateField(name)
    this.notify()
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
      // Update error state if submission fails
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
    this.state = {
      values: this.config.initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    }
    this.notify()
  }
}
