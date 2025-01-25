import React from 'react';

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

export interface A11yConfig {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

export class AccessibilityManager {
  private static configs = new Map<string, A11yConfig>();

  static setConfig(componentId: string, config: A11yConfig) {
    this.configs.set(componentId, config);
  }

  static getConfig(componentId: string): A11yConfig {
    return this.configs.get(componentId) || {};
  }

  static enhanceComponent<P extends AccessibilityProps>(
    componentId: string, 
    element: React.ReactElement<P>
  ): React.ReactElement<P> {
    const config = this.getConfig(componentId);
    return React.cloneElement<P>(element, {
      ...element.props,
      'aria-label': config.ariaLabel,
      'aria-describedby': config.ariaDescribedBy,
      role: config.role,
      tabIndex: config.tabIndex,
    });
  }
}
