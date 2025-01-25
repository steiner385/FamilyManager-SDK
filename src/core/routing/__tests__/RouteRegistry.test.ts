import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { RouteRegistry, Route } from '../RouteRegistry';
import { logger } from '../../utils/logger';

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('RouteRegistry', () => {
  let registry: RouteRegistry;
  const TestComponent = () => null;

  beforeEach(() => {
    // Reset singleton instance
    (RouteRegistry as any).instance = null;
    registry = RouteRegistry.getInstance();
    registry.clearRoutes();
    jest.clearAllMocks();
  });

  it('should maintain singleton instance', () => {
    const instance1 = RouteRegistry.getInstance();
    const instance2 = RouteRegistry.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('Route Registration', () => {
    it('should register a route', () => {
      const route: Route = {
        path: '/test',
        component: TestComponent,
        exact: true,
      };

      registry.registerRoute('test-plugin', route);
      const retrieved = registry.getRoute('test-plugin', '/test');

      expect(retrieved).toEqual(route);
      expect(logger.debug).toHaveBeenCalledWith(
        'Registered route test-plugin:/test'
      );
    });

    it('should handle route overwriting', () => {
      const route1: Route = {
        path: '/test',
        component: TestComponent,
      };

      const route2: Route = {
        path: '/test',
        component: TestComponent,
        private: true,
      };

      registry.registerRoute('test-plugin', route1);
      registry.registerRoute('test-plugin', route2);

      const retrieved = registry.getRoute('test-plugin', '/test');
      expect(retrieved).toEqual(route2);
      expect(logger.warn).toHaveBeenCalledWith(
        'Route test-plugin:/test is already registered. Overwriting...'
      );
    });

    it('should handle multiple routes from same plugin', () => {
      const routes: Route[] = [
        { path: '/route1', component: TestComponent },
        { path: '/route2', component: TestComponent },
        { path: '/route3', component: TestComponent },
      ];

      routes.forEach(route => registry.registerRoute('test-plugin', route));
      routes.forEach(route => {
        const retrieved = registry.getRoute('test-plugin', route.path);
        expect(retrieved).toEqual(route);
      });
    });

    it('should handle routes from different plugins', () => {
      const route: Route = {
        path: '/shared',
        component: TestComponent,
      };

      registry.registerRoute('plugin1', route);
      registry.registerRoute('plugin2', route);

      const retrieved1 = registry.getRoute('plugin1', '/shared');
      const retrieved2 = registry.getRoute('plugin2', '/shared');

      expect(retrieved1).toEqual(route);
      expect(retrieved2).toEqual(route);
    });
  });

  describe('Route Retrieval', () => {
    beforeEach(() => {
      const routes: Route[] = [
        { path: '/public', component: TestComponent },
        { path: '/private', component: TestComponent, private: true },
        { path: '/exact', component: TestComponent, exact: true },
      ];

      routes.forEach(route => registry.registerRoute('test-plugin', route));
    });

    it('should retrieve registered route', () => {
      const route = registry.getRoute('test-plugin', '/public');
      expect(route).toBeDefined();
      expect(route?.path).toBe('/public');
    });

    it('should return undefined for non-existent route', () => {
      const route = registry.getRoute('test-plugin', '/non-existent');
      expect(route).toBeUndefined();
    });

    it('should return undefined for non-existent plugin', () => {
      const route = registry.getRoute('non-existent-plugin', '/public');
      expect(route).toBeUndefined();
    });

    it('should get all routes', () => {
      const routes = registry.getAllRoutes();
      expect(routes).toHaveLength(3);
      expect(routes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: '/public' }),
          expect.objectContaining({ path: '/private', private: true }),
          expect.objectContaining({ path: '/exact', exact: true }),
        ])
      );
    });
  });

  describe('Route Unregistration', () => {
    const route: Route = {
      path: '/test',
      component: TestComponent,
    };

    beforeEach(() => {
      registry.registerRoute('test-plugin', route);
    });

    it('should unregister route', () => {
      registry.unregisterRoute('test-plugin', route);
      const retrieved = registry.getRoute('test-plugin', '/test');

      expect(retrieved).toBeUndefined();
      expect(logger.debug).toHaveBeenCalledWith(
        'Unregistered route test-plugin:/test'
      );
    });

    it('should handle unregistering non-existent route', () => {
      const nonExistentRoute: Route = {
        path: '/non-existent',
        component: TestComponent,
      };

      registry.unregisterRoute('test-plugin', nonExistentRoute);
      expect(logger.warn).toHaveBeenCalledWith(
        'Route test-plugin:/non-existent is not registered'
      );
    });

    it('should handle unregistering from non-existent plugin', () => {
      registry.unregisterRoute('non-existent-plugin', route);
      expect(logger.warn).toHaveBeenCalledWith(
        'Route non-existent-plugin:/test is not registered'
      );
    });
  });

  describe('Route Clearing', () => {
    beforeEach(() => {
      const routes: Route[] = [
        { path: '/route1', component: TestComponent },
        { path: '/route2', component: TestComponent },
      ];

      routes.forEach(route => {
        registry.registerRoute('plugin1', route);
        registry.registerRoute('plugin2', route);
      });
    });

    it('should clear all routes', () => {
      expect(registry.getAllRoutes()).toHaveLength(4);

      registry.clearRoutes();

      expect(registry.getAllRoutes()).toHaveLength(0);
      expect(logger.debug).toHaveBeenCalledWith('Cleared all routes');
    });

    it('should allow registering routes after clearing', () => {
      registry.clearRoutes();

      const newRoute: Route = {
        path: '/new',
        component: TestComponent,
      };

      registry.registerRoute('test-plugin', newRoute);
      const retrieved = registry.getRoute('test-plugin', '/new');
      expect(retrieved).toEqual(newRoute);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle routes with complex configurations', () => {
      const complexRoute: Route = {
        path: '/complex/:id',
        component: TestComponent,
        exact: true,
        private: true,
      };

      registry.registerRoute('test-plugin', complexRoute);
      const retrieved = registry.getRoute('test-plugin', '/complex/:id');

      expect(retrieved).toEqual(complexRoute);
    });

    it('should handle multiple operations in sequence', () => {
      const routes: Route[] = [
        { path: '/route1', component: TestComponent },
        { path: '/route2', component: TestComponent },
        { path: '/route3', component: TestComponent },
      ];

      // Register routes
      routes.forEach(route => registry.registerRoute('test-plugin', route));
      expect(registry.getAllRoutes()).toHaveLength(3);

      // Unregister middle route
      registry.unregisterRoute('test-plugin', routes[1]);
      expect(registry.getAllRoutes()).toHaveLength(2);

      // Register new route
      const newRoute: Route = { path: '/route4', component: TestComponent };
      registry.registerRoute('test-plugin', newRoute);
      expect(registry.getAllRoutes()).toHaveLength(3);

      // Clear all routes
      registry.clearRoutes();
      expect(registry.getAllRoutes()).toHaveLength(0);
    });

    it('should maintain route properties after retrieval', () => {
      const route: Route = {
        path: '/test',
        component: TestComponent,
        exact: true,
        private: true,
      };

      registry.registerRoute('test-plugin', route);
      const retrieved = registry.getRoute('test-plugin', '/test');

      expect(retrieved).toBeDefined();
      expect(retrieved?.exact).toBe(true);
      expect(retrieved?.private).toBe(true);
      expect(retrieved?.component).toBe(TestComponent);
    });
  });
});
