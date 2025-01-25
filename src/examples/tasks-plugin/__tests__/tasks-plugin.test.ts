import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Request object
global.Request = class Request {
  constructor(public url: string) {}
} as any;
import { TasksPlugin } from '../index';
import { CustomPrismaClient } from '../prisma/client';
import { Logger } from '../../../core/Logger';
import { EventBus } from '../../../events/EventBus';
import { Event } from '../../../events/types';
import { Context } from 'hono';

// Mock EventBus constructor
jest.mock('../../../events/EventBus', () => {
  return {
    EventBus: jest.fn().mockImplementation(() => ({
      subscribe: jest.fn(),
      publish: jest.fn(),
      getStats: jest.fn(),
      clearHistory: jest.fn(),
      getHistory: jest.fn(),
      stop: jest.fn()
    }))
  };
});

// Task input type
import { TaskStatus, TaskPriority } from '../types';

// Task input type for tests
interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

// Create a mock of Hono's Context
const createMockContext = () => {
  const req = {
    json: jest.fn(),
    param: jest.fn(),
    query: jest.fn(),
    queries: jest.fn(),
    header: jest.fn(),
    cookie: jest.fn(),
    parseBody: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    raw: new Request('http://localhost'),
    path: '/',
    routeIndex: 0,
    bodyCache: {},
    method: 'GET',
    url: 'http://localhost'
  };

  const context = {
    env: {},
    finalized: false,
    error: null as Error | null,
    // Request
    req,
    // Response
    res: undefined,
    // Methods
    get: jest.fn(),
    set: jest.fn(),
    status: jest.fn().mockReturnThis(),
    header: jest.fn(),
    json: jest.fn(),
    text: jest.fn(),
    body: jest.fn(),
    redirect: jest.fn(),
    // Execution context
    executionCtx: {
      waitUntil: jest.fn(),
      passThroughOnException: jest.fn()
    },
    // Event
    event: {
      request: req.raw,
      respondWith: jest.fn(),
      waitUntil: jest.fn(),
      passThroughOnException: jest.fn()
    }
  };

  return context as unknown as Context;
};

describe('TasksPlugin', () => {
  let plugin: TasksPlugin;
  let mockPrisma: jest.Mocked<CustomPrismaClient>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    // Create mock Prisma client
    mockPrisma = {
      task: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn()
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $queryRaw: jest.fn()
    } as unknown as jest.Mocked<CustomPrismaClient>;

    // Create mock event bus
    mockEventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      getStats: jest.fn(),
      clearHistory: jest.fn(),
      getHistory: jest.fn(),
      stop: jest.fn()
    } as unknown as jest.Mocked<EventBus>;

    // Create mock logger
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      child: jest.fn(),
      configure: jest.fn()
    } as unknown as jest.Mocked<Logger>;

    // Create plugin instance with mocked dependencies
    plugin = new TasksPlugin();
    (plugin as any).prisma = mockPrisma;
    plugin.context.eventBus = mockEventBus;
    plugin.context.logger = mockLogger;
  });

  describe('Lifecycle', () => {
    it('should initialize successfully', async () => {
      await plugin.init();

      expect(mockPrisma.$connect).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Initializing tasks plugin');
    });

    it('should start successfully', async () => {
      await plugin.init();
      await plugin.start();

      expect(mockLogger.info).toHaveBeenCalledWith('Starting tasks plugin');
    });

    it('should stop successfully', async () => {
      await plugin.init();
      await plugin.start();
      await plugin.stop();

      expect(mockPrisma.$disconnect).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Stopping tasks plugin');
    });
  });

  describe('Task Management', () => {
    const mockTask = {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    beforeEach(async () => {
      await plugin.init();
      await plugin.start();
    });

    it('should get tasks for a user', async () => {
      mockPrisma.task.findMany.mockResolvedValue([mockTask]);

      const context = createMockContext();
      (context.get as jest.Mock).mockReturnValue('user-1');

      await plugin['getTasks'](context);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' }
      });
      expect(context.json).toHaveBeenCalledWith([mockTask]);
    });

    it('should create a task', async () => {
      mockPrisma.task.create.mockResolvedValue(mockTask);

      const context = createMockContext();
      (context.get as jest.Mock).mockReturnValue('user-1');
      (context.req.json as jest.Mock).mockResolvedValue({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING
      } as unknown as never);

      await plugin['createTask'](context);

      expect(mockPrisma.task.create).toHaveBeenCalled();
      expect(mockEventBus.publish).toHaveBeenCalledWith('task.created', {
        taskId: mockTask.id,
        userId: 'user-1'
      });
      expect(context.json).toHaveBeenCalledWith(mockTask, 201);
    });

    it('should update a task', async () => {
      mockPrisma.task.update.mockResolvedValue({
        ...mockTask,
        status: TaskStatus.COMPLETED
      });

      const context = createMockContext();
      (context.get as jest.Mock).mockReturnValue('user-1');
      (context.req.param as jest.Mock).mockReturnValue('task-1');
      (context.req.json as jest.Mock).mockResolvedValue({
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.COMPLETED
      } as unknown as never);

      await plugin['updateTask'](context);

      expect(mockPrisma.task.update).toHaveBeenCalled();
      expect(mockEventBus.publish).toHaveBeenCalledWith('task.completed', {
        taskId: mockTask.id,
        userId: 'user-1',
        status: TaskStatus.COMPLETED
      });
    });

    it('should delete a task', async () => {
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      const context = createMockContext();
      (context.get as jest.Mock).mockReturnValue('user-1');
      (context.req.param as jest.Mock).mockReturnValue('task-1');

      await plugin['deleteTask'](context);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'task-1', userId: 'user-1' }
      });
      expect(context.json).toHaveBeenCalledWith({ message: 'Task deleted' });
    });
  });

  describe('Event Handling', () => {
    beforeEach(async () => {
      await plugin.init();
      await plugin.start();

      // Configure plugin
      plugin.context.config = {
        autoAssignTasks: true,
        notifyOnAssignment: true
      };
    });

    it('should handle user.created event', async () => {
      const unassignedTasks = [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' }
      ];

      mockPrisma.task.findMany.mockResolvedValue(unassignedTasks);
      mockPrisma.task.update.mockImplementation(async (args) => ({
        ...unassignedTasks.find(t => t.id === args.where.id)!,
        assignedTo: args.data.assignedTo
      }));

      const event: Event = {
        id: '123',
        type: 'user.created',
        data: { userId: 'new-user' },
        metadata: {
          timestamp: Date.now(),
          source: 'test',
          version: '1.0'
        }
      };

      await plugin['handleEvent'](event);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { assignedTo: null, status: TaskStatus.PENDING }
      });
      expect(mockPrisma.task.update).toHaveBeenCalledTimes(2);
      expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
    });

    it('should handle family.updated event', async () => {
      const familyTasks = [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' }
      ];

      mockPrisma.task.findMany.mockResolvedValue(familyTasks);

      const event: Event = {
        id: '123',
        type: 'family.updated',
        data: { familyId: 'family-1' },
        metadata: {
          timestamp: Date.now(),
          source: 'test',
          version: '1.0'
        }
      };

      await plugin['handleEvent'](event);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: {
          user: {
            familyId: 'family-1'
          }
        }
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Updated 2 tasks for family family-1'
      );
    });
  });

  describe('Health Checks', () => {
    beforeEach(async () => {
      await plugin.init();
      await plugin.start();
    });

    it('should report healthy when database is connected', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ 1: 1 }]);
      mockPrisma.task.count.mockResolvedValue(10);

      const health = await plugin.getHealth();

      expect(health.status).toBe('healthy');
      expect(health.message).toBe('Plugin is healthy');
      expect(health.metrics).toBeDefined();
    });

    it('should report unhealthy when database connection fails', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      const health = await plugin.getHealth();

      expect(health.status).toBe('unhealthy');
      expect(health.message).toBe('Database connection failed');
    });
  });
});
