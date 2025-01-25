import { BasePlugin } from '../../core/BasePlugin';
import type { PluginConfig, PluginHealthCheck } from '../../types/plugin';
import type { Event } from '../../events/types';
import type { BaseRouteConfig } from '../../types/base';

interface TaskRouteConfig extends BaseRouteConfig {
  handler: (c: Context) => Promise<Response>;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}
import { z } from 'zod';
import { prisma, CustomPrismaClient } from './prisma/client';
import { Context } from 'hono';

/**
 * Task schema for validation
 */
import { TaskStatus, TaskPriority } from './types';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING)
});

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  assignedTo?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskInput = z.infer<typeof taskSchema>;

/**
 * Plugin configuration schema
 */
const configSchema = z.object({
  defaultPriority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  autoAssignTasks: z.boolean().default(false),
  notifyOnAssignment: z.boolean().default(true),
  notifyOnCompletion: z.boolean().default(true)
});

type TasksPluginConfig = z.infer<typeof configSchema>;

/**
 * Tasks plugin that demonstrates database integration and API endpoints
 */
export class TasksPlugin extends BasePlugin {
  private prisma: CustomPrismaClient = prisma;
  private metricsInterval?: NodeJS.Timeout;
  private taskMetrics = {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  };

  constructor() {
    const baseConfig: PluginConfig = {
      id: 'tasks-plugin',
      name: 'tasks-plugin',
      version: '1.0.0',
      metadata: {
        id: 'tasks-plugin',
        name: 'tasks-plugin',
        version: '1.0.0',
        description: 'Task management plugin',
        author: 'FamilyManager'
      },
      config: configSchema,
      events: {
        subscriptions: ['user.created', 'family.updated'],
        publications: ['task.created', 'task.updated', 'task.completed']
      }
    };

    super(baseConfig);
  }

  /**
   * Initialize plugin
   */
  async onInit(): Promise<void> {
    this.context.logger.info('Initializing tasks plugin');
    
    // Initialize database connection
    await this.prisma.$connect();

    // Initialize metrics
    await this.updateMetrics();
  }

  /**
   * Start plugin
   */
  async onStart(): Promise<void> {
    this.context.logger.info('Starting tasks plugin');

    // Start periodic metrics updates
    this.metricsInterval = setInterval(() => this.updateMetrics(), 60000);
  }

  /**
   * Stop plugin
   */
  async onStop(): Promise<void> {
    this.context.logger.info('Stopping tasks plugin');

    // Clear metrics interval
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Close database connection
    await this.prisma.$disconnect();
  }

  /**
   * Handle events
   */
  protected async handleEvent(event: Event): Promise<void> {
    switch (event.type) {
      case 'user.created':
        if ((this.context.config as TasksPluginConfig).autoAssignTasks) {
          await this.autoAssignTasks(event.data.userId);
        }
        break;

      case 'family.updated':
        await this.updateFamilyTasks(event.data.familyId);
        break;
    }
  }

  /**
   * Define plugin routes
   */
  private getRoutes(): TaskRouteConfig[] {
    return [
      {
        path: '/api/tasks',
        method: 'GET',
        component: () => null, // Placeholder component
        handler: this.getTasks.bind(this),
        description: 'Get all tasks'
      },
      {
        path: '/api/tasks',
        method: 'POST',
        component: () => null, // Placeholder component
        handler: this.createTask.bind(this),
        description: 'Create a new task'
      },
      {
        path: '/api/tasks/:id',
        method: 'PUT',
        component: () => null, // Placeholder component
        handler: this.updateTask.bind(this),
        description: 'Update a task'
      },
      {
        path: '/api/tasks/:id',
        method: 'DELETE',
        component: () => null, // Placeholder component
        handler: this.deleteTask.bind(this),
        description: 'Delete a task'
      }
    ];
  }

  /**
   * Get tasks
   */
  private async getTasks(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId');
      const tasks = await this.prisma.task.findMany({
        where: { userId }
      });
      return c.json(tasks);
    } catch (error) {
      this.context.logger.error('Error getting tasks', error as Error);
      return c.json({ error: 'Failed to get tasks' }, 500);
    }
  }

  /**
   * Create task
   */
  private async createTask(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId');
      const data = await c.req.json();
      
      // Validate task data
      const validatedData = taskSchema.parse(data) as TaskInput;

      // Create task
      const task = await this.prisma.task.create({
        data: {
          ...validatedData,
          userId
        }
      });

      // Publish event
      await this.context.eventBus.publish('task.created', {
        taskId: task.id,
        userId
      });

      // Update metrics
      await this.updateMetrics();

      return c.json(task, 201);
    } catch (error) {
      this.context.logger.error('Error creating task', error as Error);
      return c.json({ error: 'Failed to create task' }, 500);
    }
  }

  /**
   * Update task
   */
  private async updateTask(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId');
      const taskId = c.req.param('id');
      const data = await c.req.json();

      // Validate task data
      const validatedData = taskSchema.parse(data) as TaskInput;

      // Update task
      const task = await this.prisma.task.update({
        where: { id: taskId, userId },
        data: validatedData
      });

      // Publish event
      await this.context.eventBus.publish(
        task.status === TaskStatus.COMPLETED ? 'task.completed' : 'task.updated',
        {
          taskId: task.id,
          userId,
          status: task.status
        }
      );

      // Update metrics
      await this.updateMetrics();

      return c.json(task);
    } catch (error) {
      this.context.logger.error('Error updating task', error as Error);
      return c.json({ error: 'Failed to update task' }, 500);
    }
  }

  /**
   * Delete task
   */
  private async deleteTask(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId');
      const taskId = c.req.param('id');

      await this.prisma.task.delete({
        where: { id: taskId, userId }
      });

      // Update metrics
      await this.updateMetrics();

      return c.json({ message: 'Task deleted' });
    } catch (error) {
      this.context.logger.error('Error deleting task', error as Error);
      return c.json({ error: 'Failed to delete task' }, 500);
    }
  }

  /**
   * Auto-assign tasks to new user
   */
  private async autoAssignTasks(userId: string): Promise<void> {
    try {
      const unassignedTasks = await this.prisma.task.findMany({
        where: { assignedTo: null, status: TaskStatus.PENDING }
      });

      for (const task of unassignedTasks) {
        await this.prisma.task.update({
          where: { id: task.id },
          data: { assignedTo: userId }
        });

        if ((this.context.config as TasksPluginConfig).notifyOnAssignment) {
          await this.context.eventBus.publish('task.updated', {
            taskId: task.id,
            userId,
            status: TaskStatus.PENDING
          });
        }
      }
    } catch (error) {
      this.context.logger.error('Error auto-assigning tasks', error as Error);
    }
  }

  /**
   * Update family tasks
   */
  private async updateFamilyTasks(familyId: string): Promise<void> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          user: {
            familyId
          }
        }
      });

      this.context.logger.info(`Updated ${tasks.length} tasks for family ${familyId}`);
    } catch (error) {
      this.context.logger.error('Error updating family tasks', error as Error);
    }
  }

  /**
   * Update task metrics
   */
  private async updateMetrics(): Promise<void> {
    try {
      const [total, completed, overdue] = await Promise.all([
        this.prisma.task.count(),
        this.prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
        this.prisma.task.count({
          where: {
            dueDate: { lt: new Date() },
            status: { not: TaskStatus.COMPLETED }
          }
        })
      ]);

      this.taskMetrics = {
        totalTasks: total,
        completedTasks: completed,
        overdueTasks: overdue
      };
    } catch (error) {
      this.context.logger.error('Error updating metrics', error as Error);
    }
  }

  /**
   * Get plugin health status
   */
  async getHealth(): Promise<PluginHealthCheck> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Calculate trends
      const completionTrend = this.taskMetrics.totalTasks > 0 
        ? this.taskMetrics.completedTasks / this.taskMetrics.totalTasks 
        : 0;

      const overdueTrend = this.taskMetrics.totalTasks > 0
        ? this.taskMetrics.overdueTasks / this.taskMetrics.totalTasks
        : 0;

      return {
        status: 'healthy',
        timestamp: Date.now(),
        message: 'Plugin is healthy',
        metrics: {
          memory: {
            current: process.memoryUsage().heapUsed / 1024 / 1024, // MB
            trend: 0,
            history: []
          },
          cpu: {
            current: 0, // Would need actual CPU metrics
            trend: 0,
            history: []
          },
          responseTime: {
            current: 100, // Example value
            trend: 0,
            history: []
          }
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        message: 'Database connection failed',
        metrics: {
          memory: {
            current: 0,
            trend: 0,
            history: []
          },
          cpu: {
            current: 0,
            trend: 0,
            history: []
          },
          responseTime: {
            current: 0,
            trend: 0,
            history: []
          }
        }
      };
    }
  }
}
