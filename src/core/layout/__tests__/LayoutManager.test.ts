import { describe, expect, it, beforeEach } from '@jest/globals';
import { LayoutManager } from '../LayoutManager';
import type { LayoutConfig } from '../types';

describe('LayoutManager', () => {
  let manager: LayoutManager;

  beforeEach(() => {
    // Reset singleton instance
    (LayoutManager as any).instance = null;
    manager = LayoutManager.getInstance();
  });

  it('should maintain singleton instance', () => {
    const instance1 = LayoutManager.getInstance();
    const instance2 = LayoutManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('Layout Registration', () => {
    it('should register a layout', () => {
      const config: LayoutConfig = {
        id: 'test-layout',
        areas: [['header'], ['content'], ['footer']],
        components: {
          header: { componentId: 'header-component' },
          content: { componentId: 'content-component' },
          footer: { componentId: 'footer-component' },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('test-layout');
      expect(retrieved).toEqual(config);
    });

    it('should override existing layout with same id', () => {
      const initialConfig: LayoutConfig = {
        id: 'test-layout',
        areas: [['header'], ['content']],
        components: {
          header: { componentId: 'header-v1' },
          content: { componentId: 'content-v1' },
        },
      };

      const updatedConfig: LayoutConfig = {
        id: 'test-layout',
        areas: [['header'], ['content'], ['footer']],
        components: {
          header: { componentId: 'header-v2' },
          content: { componentId: 'content-v2' },
          footer: { componentId: 'footer-v2' },
        },
      };

      manager.registerLayout(initialConfig);
      manager.registerLayout(updatedConfig);

      const retrieved = manager.getLayout('test-layout');
      expect(retrieved).toEqual(updatedConfig);
      expect(retrieved).not.toEqual(initialConfig);
    });

    it('should handle layouts with component props', () => {
      const config: LayoutConfig = {
        id: 'layout-with-props',
        areas: [['widget']],
        components: {
          widget: {
            componentId: 'widget-component',
            props: {
              title: 'Test Widget',
              showHeader: true,
              data: { key: 'value' },
            },
          },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('layout-with-props');
      expect(retrieved?.components.widget.props).toEqual({
        title: 'Test Widget',
        showHeader: true,
        data: { key: 'value' },
      });
    });
  });

  describe('Layout Retrieval', () => {
    it('should return undefined for non-existent layout', () => {
      const layout = manager.getLayout('non-existent');
      expect(layout).toBeUndefined();
    });

    it('should retrieve registered layout', () => {
      const config: LayoutConfig = {
        id: 'test-layout',
        areas: [['content']],
        components: {
          content: { componentId: 'content-component' },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('test-layout');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-layout');
    });
  });

  describe('Layout Removal', () => {
    it('should remove registered layout', () => {
      const config: LayoutConfig = {
        id: 'test-layout',
        areas: [['content']],
        components: {
          content: { componentId: 'content-component' },
        },
      };

      manager.registerLayout(config);
      manager.removeLayout('test-layout');
      const retrieved = manager.getLayout('test-layout');
      expect(retrieved).toBeUndefined();
    });

    it('should handle removing non-existent layout', () => {
      expect(() => manager.removeLayout('non-existent')).not.toThrow();
    });
  });

  describe('Complex Layout Configurations', () => {
    it('should handle grid-style layouts', () => {
      const config: LayoutConfig = {
        id: 'grid-layout',
        areas: [
          ['header', 'header', 'header'],
          ['sidebar', 'content', 'widgets'],
          ['footer', 'footer', 'footer'],
        ],
        components: {
          header: { componentId: 'header-component' },
          sidebar: { componentId: 'sidebar-component' },
          content: { componentId: 'content-component' },
          widgets: { componentId: 'widgets-component' },
          footer: { componentId: 'footer-component' },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('grid-layout');
      expect(retrieved?.areas).toEqual([
        ['header', 'header', 'header'],
        ['sidebar', 'content', 'widgets'],
        ['footer', 'footer', 'footer'],
      ]);
    });

    it('should handle layouts with nested component props', () => {
      const config: LayoutConfig = {
        id: 'nested-props-layout',
        areas: [['dashboard']],
        components: {
          dashboard: {
            componentId: 'dashboard-component',
            props: {
              widgets: [
                { id: 'w1', type: 'chart', data: { series: [1, 2, 3] } },
                { id: 'w2', type: 'metrics', data: { value: 42 } },
              ],
              settings: {
                theme: {
                  primary: '#007bff',
                  secondary: '#6c757d',
                },
                layout: {
                  columns: 2,
                  spacing: 16,
                },
              },
            },
          },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('nested-props-layout');
      expect(retrieved?.components.dashboard.props).toEqual(config.components.dashboard.props);
    });

    it('should handle asymmetric layouts', () => {
      const config: LayoutConfig = {
        id: 'asymmetric-layout',
        areas: [
          ['header', 'header'],
          ['sidebar', 'content', 'content'],
          ['footer'],
        ],
        components: {
          header: { componentId: 'header-component' },
          sidebar: { componentId: 'sidebar-component' },
          content: { componentId: 'content-component' },
          footer: { componentId: 'footer-component' },
        },
      };

      manager.registerLayout(config);
      const retrieved = manager.getLayout('asymmetric-layout');
      expect(retrieved?.areas).toEqual([
        ['header', 'header'],
        ['sidebar', 'content', 'content'],
        ['footer'],
      ]);
    });

    it('should handle multiple independent layouts', () => {
      const layouts: LayoutConfig[] = [
        {
          id: 'layout-1',
          areas: [['content']],
          components: {
            content: { componentId: 'component-1' },
          },
        },
        {
          id: 'layout-2',
          areas: [['header'], ['content']],
          components: {
            header: { componentId: 'component-2' },
            content: { componentId: 'component-3' },
          },
        },
        {
          id: 'layout-3',
          areas: [['widget-1', 'widget-2']],
          components: {
            'widget-1': { componentId: 'component-4' },
            'widget-2': { componentId: 'component-5' },
          },
        },
      ];

      layouts.forEach(layout => manager.registerLayout(layout));

      layouts.forEach(layout => {
        const retrieved = manager.getLayout(layout.id);
        expect(retrieved).toEqual(layout);
      });

      // Remove middle layout
      manager.removeLayout('layout-2');

      expect(manager.getLayout('layout-1')).toBeDefined();
      expect(manager.getLayout('layout-2')).toBeUndefined();
      expect(manager.getLayout('layout-3')).toBeDefined();
    });
  });
});
