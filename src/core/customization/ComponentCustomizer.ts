import React, { ComponentType } from 'react'

interface CustomizationOptions {
  styles?: Record<string, any>
  props?: Record<string, any>
  behaviors?: Record<string, (...args: any[]) => void>
}

export class ComponentCustomizer {
  private static customizations = new Map<string, CustomizationOptions>()

  static customize(
    pluginName: string,
    componentName: string,
    options: CustomizationOptions
  ) {
    const key = `${pluginName}:${componentName}`
    this.customizations.set(key, options)
  }

  static getCustomizations(
    pluginName: string,
    componentName: string
  ): CustomizationOptions {
    const key = `${pluginName}:${componentName}`
    return this.customizations.get(key) || {}
  }

  static withCustomizations<P extends object>(
    WrappedComponent: ComponentType<P>,
    pluginName: string,
    componentName: string
  ): React.FC<P> {
    return function CustomizedComponent(props: P) {
      const customizations = ComponentCustomizer.getCustomizations(
        pluginName,
        componentName
      )

      return React.createElement(WrappedComponent, {
        ...customizations.props,
        ...props,
        style: {
          ...customizations.styles,
          ...(props as any).style,
        }
      })
    }
  }
}
