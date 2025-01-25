import { renderHook, act } from '@testing-library/react'
import { usePlugin } from '../usePlugin'
import { PluginManager } from '../../core/plugin/PluginManager'
import { createMockPlugin } from '../../core/testing/utils/testHelpers'

jest.mock('../../core/plugin/PluginManager')

describe('usePlugin', () => {
  const mockPlugin = createMockPlugin({
    name: 'test-plugin',
    version: '1.0.0'
  })
  
  const mockManager = {
    getInstance: jest.fn().mockReturnValue({
      initializePlugin: jest.fn().mockResolvedValue(undefined),
      getPlugin: jest.fn().mockReturnValue(mockPlugin),
      isInitialized: jest.fn().mockReturnValue(false)
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // @ts-ignore
    PluginManager.getInstance = mockManager.getInstance
  })

  it('initializes plugin and returns status', async () => {
    const { result } = renderHook(() => usePlugin('test-plugin'))

    expect(result.current.isReady).toBe(false)
    expect(result.current.error).toBeNull()

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockManager.getInstance().initializePlugin).toHaveBeenCalledWith('test-plugin')
    expect(result.current.plugin).toBe(mockPlugin)
    expect(result.current.isReady).toBe(true)
  })

  it('handles initialization errors', async () => {
    const error = new Error('Init failed')
    mockManager.getInstance().initializePlugin.mockRejectedValueOnce(error)

    const { result } = renderHook(() => usePlugin('test-plugin'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe(error)
    expect(result.current.isReady).toBe(false)
    expect(result.current.plugin).toBeNull()
  })

  it('handles missing plugins', () => {
    mockManager.getInstance().getPlugin.mockReturnValueOnce(undefined)

    const { result } = renderHook(() => usePlugin('non-existent-plugin'))

    expect(result.current.error?.message).toBe('Plugin non-existent-plugin not found')
    expect(result.current.isReady).toBe(false)
    expect(result.current.plugin).toBeNull()
  })

  it('returns initialized plugin without reinitializing', () => {
    mockManager.getInstance().isInitialized.mockReturnValueOnce(true)

    const { result } = renderHook(() => usePlugin('test-plugin'))

    expect(result.current.plugin).toBe(mockPlugin)
    expect(result.current.isReady).toBe(true)
    expect(result.current.error).toBeNull()
    expect(mockManager.getInstance().initializePlugin).not.toHaveBeenCalled()
  })
})
