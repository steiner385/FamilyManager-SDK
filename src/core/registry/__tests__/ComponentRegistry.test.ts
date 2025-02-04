import React, { ComponentType } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ComponentRegistry } from '../ComponentRegistry'

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    // Reset singleton instance
    // @ts-ignore - accessing private property for testing
    ComponentRegistry.instance = null
    registry = ComponentRegistry.getInstance()
  })

  it('should maintain singleton instance', () => {
    const instance1 = ComponentRegistry.getInstance()
    const instance2 = ComponentRegistry.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should register a component with metadata', () => {
    const TestComponent: ComponentType = () => React.createElement('div', null, 'Test')
    const metadata = {
      name: 'TestComponent',
      description: 'A test component',
      props: {
        title: {
          type: 'string',
          required: true,
          description: 'The component title'
        }
      }
    }

    registry.register('TestComponent', TestComponent, metadata)

    expect(registry.get('TestComponent')).toBe(TestComponent)
    expect(registry.getMetadata('TestComponent')).toEqual(metadata)
  })

  it('should prevent duplicate registration', () => {
    const TestComponent: ComponentType = () => {
      return React.createElement('div', null, 'Test')
    }
    registry.register('TestComponent', TestComponent)

    expect(() => {
      registry.register('TestComponent', TestComponent)
    }).toThrow('Component "TestComponent" is already registered')
  })

  it('should return undefined for non-existent components', () => {
    expect(registry.get('NonExistent')).toBeUndefined()
    expect(registry.getMetadata('NonExistent')).toBeUndefined()
  })

  it('should return all registered components', () => {
    const Component1: ComponentType = () => {
      return React.createElement('div', null, 'One')
    }
    const Component2: ComponentType = () => {
      return React.createElement('div', null, 'Two')
    }

    registry.register('Component1', Component1)
    registry.register('Component2', Component2)

    const components = registry.getAllComponents()
    expect(components).toHaveLength(2)
    expect(components).toEqual([
      ['Component1', Component1],
      ['Component2', Component2]
    ])
  })

  it('should handle component registration with render testing', () => {
    interface TestProps {
      title: string
    }
    const TestComponent: ComponentType<TestProps> = ({ title }) => {
      return React.createElement('div', null, title)
    }
    registry.register<TestProps>('TestComponent', TestComponent)

    const RegisteredComponent = registry.get<TestProps>('TestComponent')
    expect(RegisteredComponent).toBeTruthy()

    if (RegisteredComponent) {
      const { getByText } = render(React.createElement(RegisteredComponent, { title: 'Test Title' }))
      expect(getByText('Test Title')).toBeInTheDocument()
    }
  })
})
