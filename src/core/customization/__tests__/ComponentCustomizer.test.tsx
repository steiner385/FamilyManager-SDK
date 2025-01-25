import React from 'react';
import { render } from '@testing-library/react';
import { ComponentCustomizer } from '../ComponentCustomizer';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

interface TestComponentProps {
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

describe('ComponentCustomizer', () => {
  const TestComponent: React.FC<TestComponentProps> = (props) => (
    <div style={props.style} className={props.className} onClick={props.onClick}>
      {props.title}
    </div>
  );

  beforeEach(() => {
    // Reset customizations before each test
    (ComponentCustomizer as any).customizations = new Map();
  });

  it('should register and retrieve customizations', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      styles: { color: 'red' },
      props: { className: 'custom-class' },
      behaviors: {
        onClick: jest.fn()
      }
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const retrieved = ComponentCustomizer.getCustomizations(pluginName, componentName);

    expect(retrieved).toEqual(customizations);
  });

  it('should return empty object for non-existent customizations', () => {
    const retrieved = ComponentCustomizer.getCustomizations('non-existent', 'Component');
    expect(retrieved).toEqual({});
  });

  it('should wrap component with customizations', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      styles: { color: 'blue', fontSize: '16px' },
      props: { className: 'custom-class' }
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      componentName
    );

    const { container } = render(<CustomizedComponent />);
    const element = container.firstChild as HTMLElement;

    expect(element.style.color).toBe('blue');
    expect(element.style.fontSize).toBe('16px');
    expect(element.className).toBe('custom-class');
  });

  it('should merge styles correctly', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      styles: { color: 'red', fontSize: '16px' }
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      componentName
    );

    const instanceStyles = { fontSize: '20px', fontWeight: 'bold' };
    const { container } = render(<CustomizedComponent style={instanceStyles} />);
    const element = container.firstChild as HTMLElement;

    expect(element.style.color).toBe('red'); // From customization
    expect(element.style.fontSize).toBe('20px'); // Overridden by instance
    expect(element.style.fontWeight).toBe('bold'); // From instance
  });

  it('should merge props correctly', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      props: { title: 'Custom Title', className: 'custom-class' }
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      componentName
    );

    const { container } = render(
      <CustomizedComponent title="Instance Title" className="instance-class" />
    );
    const element = container.firstChild as HTMLElement;

    expect(element.textContent).toBe('Instance Title'); // Props from instance take precedence
    expect(element.className).toBe('instance-class'); // Props from instance take precedence
  });

  it('should handle multiple component customizations independently', () => {
    const pluginName = 'test-plugin';
    const customizations1 = {
      styles: { color: 'red' },
      props: { title: 'Component 1' }
    };
    const customizations2 = {
      styles: { color: 'blue' },
      props: { title: 'Component 2' }
    };

    ComponentCustomizer.customize(pluginName, 'Component1', customizations1);
    ComponentCustomizer.customize(pluginName, 'Component2', customizations2);

    const CustomizedComponent1 = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      'Component1'
    );
    const CustomizedComponent2 = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      'Component2'
    );

    const { container: container1 } = render(<CustomizedComponent1 />);
    const { container: container2 } = render(<CustomizedComponent2 />);

    const element1 = container1.firstChild as HTMLElement;
    const element2 = container2.firstChild as HTMLElement;

    expect(element1.style.color).toBe('red');
    expect(element1.textContent).toBe('Component 1');
    expect(element2.style.color).toBe('blue');
    expect(element2.textContent).toBe('Component 2');
  });

  it('should handle undefined customizations gracefully', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      styles: undefined,
      props: undefined,
      behaviors: undefined
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      componentName
    );

    const { container } = render(<CustomizedComponent title="Test" />);
    const element = container.firstChild as HTMLElement;

    expect(element.textContent).toBe('Test');
  });

  it('should handle component with no customizations', () => {
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      'test-plugin',
      'TestComponent'
    );

    const { container } = render(
      <CustomizedComponent title="Original" style={{ margin: '10px' }} />
    );
    const element = container.firstChild as HTMLElement;

    expect(element.textContent).toBe('Original');
    expect(element.style.margin).toBe('10px');
  });

  it('should handle complex nested styles', () => {
    const pluginName = 'test-plugin';
    const componentName = 'TestComponent';
    const customizations = {
      styles: {
        color: 'red',
        padding: '10px',
        border: '1px solid black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)'
      }
    };

    ComponentCustomizer.customize(pluginName, componentName, customizations);
    const CustomizedComponent = ComponentCustomizer.withCustomizations(
      TestComponent,
      pluginName,
      componentName
    );

    const instanceStyles = {
      padding: '20px',
      margin: '5px',
      transform: 'scale(0.9)'
    };

    const { container } = render(<CustomizedComponent style={instanceStyles} />);
    const element = container.firstChild as HTMLElement;

    expect(element.style.color).toBe('red'); // From customization
    expect(element.style.padding).toBe('20px'); // Overridden by instance
    expect(element.style.margin).toBe('5px'); // From instance
    expect(element.style.border).toBe('1px solid black'); // From customization
    expect(element.style.transform).toBe('scale(0.9)'); // Overridden by instance
  });

  it('should handle customizations from different plugins', () => {
    const componentName = 'SharedComponent';
    const plugin1Customizations = {
      styles: { color: 'red' },
      props: { title: 'Plugin 1' }
    };
    const plugin2Customizations = {
      styles: { color: 'blue' },
      props: { title: 'Plugin 2' }
    };

    ComponentCustomizer.customize('plugin1', componentName, plugin1Customizations);
    ComponentCustomizer.customize('plugin2', componentName, plugin2Customizations);

    const CustomizedComponent1 = ComponentCustomizer.withCustomizations(
      TestComponent,
      'plugin1',
      componentName
    );
    const CustomizedComponent2 = ComponentCustomizer.withCustomizations(
      TestComponent,
      'plugin2',
      componentName
    );

    const { container: container1 } = render(<CustomizedComponent1 />);
    const { container: container2 } = render(<CustomizedComponent2 />);

    expect((container1.firstChild as HTMLElement).style.color).toBe('red');
    expect((container2.firstChild as HTMLElement).style.color).toBe('blue');
  });
});
