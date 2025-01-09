import { StatePersistenceManager } from '../StatePersistenceManager'

describe('StatePersistenceManager', () => {
  let manager: StatePersistenceManager

  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear()
    sessionStorage.clear()
    manager = StatePersistenceManager.getInstance()
  })

  it('persists and retrieves state from localStorage', () => {
    const testState = { foo: 'bar' }
    manager.persist('test-key', testState, { storage: 'local' })
    const retrieved = manager.retrieve('test-key', { storage: 'local' })
    expect(retrieved).toEqual(testState)
  })

  it('handles state versioning', () => {
    const testState = { foo: 'bar' }
    manager.persist('test-key', testState, { version: 2 })
    const retrieved = manager.retrieve('test-key', { version: 2 })
    expect(retrieved).toEqual(testState)
  })

  it('migrates state when version changes', () => {
    const oldState = { foo: 'bar' }
    const migrate = jest.fn().mockReturnValue({ foo: 'migrated' })
    
    manager.persist('test-key', oldState, { version: 1 })
    const retrieved = manager.retrieve('test-key', { 
      version: 2,
      migrate
    })

    expect(migrate).toHaveBeenCalledWith(oldState, 1)
    expect(retrieved).toEqual({ foo: 'migrated' })
  })
})
