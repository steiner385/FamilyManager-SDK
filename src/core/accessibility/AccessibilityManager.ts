interface A11yConfig {
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  tabIndex?: number
}

export class AccessibilityManager {
  private static configs = new Map<string, A11yConfig>()

  static setConfig(componentId: string, config: A11yConfig) {
    this.configs.set(componentId, config)
  }

  static getConfig(componentId: string): A11yConfig {
    return this.configs.get(componentId) || {}
  }

  static enhanceComponent(componentId: string, element: JSX.Element): JSX.Element {
    const config = this.getConfig(componentId)
    return {
      ...element,
      props: {
        ...element.props,
        'aria-label': config.ariaLabel,
        'aria-describedby': config.ariaDescribedBy,
        role: config.role,
        tabIndex: config.tabIndex,
      },
    }
  }
}
