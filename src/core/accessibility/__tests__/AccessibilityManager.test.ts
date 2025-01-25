import { AccessibilityManager } from '../AccessibilityManager'

describe('AccessibilityManager', () => {
  beforeEach(() => {
    // Reset configs before each test
    // @ts-ignore - accessing private property for testing
    AccessibilityManager.configs = new Map()
  })

  it('sets and gets accessibility config', () => {
    const config = {
      ariaLabel: 'Test Label',
      role: 'button'
    }
    
    AccessibilityManager.setConfig('test-component', config)
    expect(AccessibilityManager.getConfig('test-component')).toEqual(config)
  })

  it('enhances component with accessibility attributes', () => {
    const config = {
      ariaLabel: 'Test Label',
      role: 'button',
      tabIndex: 0
    }
    
    AccessibilityManager.setConfig('test-component', config)
    
    const element = {
      type: 'button',
      props: {}
    }

    const enhanced = AccessibilityManager.enhanceComponent('test-component', element)
    
    expect(enhanced.props).toEqual({
      'aria-label': 'Test Label',
      role: 'button',
      tabIndex: 0
    })
  })
})
