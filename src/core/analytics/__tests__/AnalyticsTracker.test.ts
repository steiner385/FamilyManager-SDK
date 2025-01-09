import { AnalyticsTracker } from '../AnalyticsTracker'

const mockAnalyticsEvent = {
  category: 'Test',
  action: 'test-action',
  label: 'test-label',
  metadata: {
    testKey: 'testValue'
  }
}

describe('AnalyticsTracker', () => {
  beforeEach(() => {
    // Clear handlers before each test
    // @ts-ignore - accessing private property for testing
    AnalyticsTracker.handlers.clear()
  })

  it('registers and calls event handlers', () => {
    const handler = jest.fn()
    AnalyticsTracker.registerHandler(handler)
    AnalyticsTracker.trackEvent(mockAnalyticsEvent)
    expect(handler).toHaveBeenCalledWith(mockAnalyticsEvent)
  })

  it('tracks component events with correct format', () => {
    const handler = jest.fn()
    AnalyticsTracker.registerHandler(handler)
    
    AnalyticsTracker.trackComponentEvent('test-component', 'click', { foo: 'bar' })
    
    expect(handler).toHaveBeenCalledWith({
      category: 'Component',
      action: 'click',
      label: 'test-component',
      metadata: { foo: 'bar' }
    })
  })
})
