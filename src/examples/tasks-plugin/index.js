import { BasePlugin } from '../../core/BasePlugin';
import { z } from 'zod';
import { prisma } from './prisma/client';
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
/**
 * Plugin configuration schema
 */
const configSchema = z.object({
    defaultPriority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
    autoAssignTasks: z.boolean().default(false),
    notifyOnAssignment: z.boolean().default(true),
    notifyOnCompletion: z.boolean().default(true)
});
/**
 * Tasks plugin that demonstrates database integration and API endpoints
 */
export class TasksPlugin extends BasePlugin {
    constructor() {
        const baseConfig = {
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
        this.prisma = prisma;
        this.taskMetrics = {
            totalTasks: 0,
            completedTasks: 0,
            overdueTasks: 0
        };
    }
    /**
     * Initialize plugin
     */
    async onInit() {
        this.context.logger.info('Initializing tasks plugin');
        // Initialize database connection
        await this.prisma.$connect();
        // Initialize metrics
        await this.updateMetrics();
    }
    /**
     * Start plugin
     */
    async onStart() {
        this.context.logger.info('Starting tasks plugin');
        // Start periodic metrics updates
        this.metricsInterval = setInterval(() => this.updateMetrics(), 60000);
    }
    /**
     * Stop plugin
     */
    async onStop() {
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
    async handleEvent(event) {
        switch (event.type) {
            case 'user.created':
                if (this.context.config.autoAssignTasks) {
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
    getRoutes() {
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
    async getTasks(c) {
        try {
            const userId = c.get('userId');
            const tasks = await this.prisma.task.findMany({
                where: { userId }
            });
            return c.json(tasks);
        }
        catch (error) {
            this.context.logger.error('Error getting tasks', error);
            return c.json({ error: 'Failed to get tasks' }, 500);
        }
    }
    /**
     * Create task
     */
    async createTask(c) {
        try {
            const userId = c.get('userId');
            const data = await c.req.json();
            // Validate task data
            const validatedData = taskSchema.parse(data);
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
        }
        catch (error) {
            this.context.logger.error('Error creating task', error);
            return c.json({ error: 'Failed to create task' }, 500);
        }
    }
    /**
     * Update task
     */
    async updateTask(c) {
        try {
            const userId = c.get('userId');
            const taskId = c.req.param('id');
            const data = await c.req.json();
            // Validate task data
            const validatedData = taskSchema.parse(data);
            // Update task
            const task = await this.prisma.task.update({
                where: { id: taskId, userId },
                data: validatedData
            });
            // Publish event
            await this.context.eventBus.publish(task.status === TaskStatus.COMPLETED ? 'task.completed' : 'task.updated', {
                taskId: task.id,
                userId,
                status: task.status
            });
            // Update metrics
            await this.updateMetrics();
            return c.json(task);
        }
        catch (error) {
            this.context.logger.error('Error updating task', error);
            return c.json({ error: 'Failed to update task' }, 500);
        }
    }
    /**
     * Delete task
     */
    async deleteTask(c) {
        try {
            const userId = c.get('userId');
            const taskId = c.req.param('id');
            await this.prisma.task.delete({
                where: { id: taskId, userId }
            });
            // Update metrics
            await this.updateMetrics();
            return c.json({ message: 'Task deleted' });
        }
        catch (error) {
            this.context.logger.error('Error deleting task', error);
            return c.json({ error: 'Failed to delete task' }, 500);
        }
    }
    /**
     * Auto-assign tasks to new user
     */
    async autoAssignTasks(userId) {
        try {
            const unassignedTasks = await this.prisma.task.findMany({
                where: { assignedTo: null, status: TaskStatus.PENDING }
            });
            for (const task of unassignedTasks) {
                await this.prisma.task.update({
                    where: { id: task.id },
                    data: { assignedTo: userId }
                });
                if (this.context.config.notifyOnAssignment) {
                    await this.context.eventBus.publish('task.updated', {
                        taskId: task.id,
                        userId,
                        status: TaskStatus.PENDING
                    });
                }
            }
        }
        catch (error) {
            this.context.logger.error('Error auto-assigning tasks', error);
        }
    }
    /**
     * Update family tasks
     */
    async updateFamilyTasks(familyId) {
        try {
            const tasks = await this.prisma.task.findMany({
                where: {
                    user: {
                        familyId
                    }
                }
            });
            this.context.logger.info(`Updated ${tasks.length} tasks for family ${familyId}`);
        }
        catch (error) {
            this.context.logger.error('Error updating family tasks', error);
        }
    }
    /**
     * Update task metrics
     */
    async updateMetrics() {
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
        }
        catch (error) {
            this.context.logger.error('Error updating metrics', error);
        }
    }
    /**
     * Get plugin health status
     */
    async getHealth() {
        try {
            // Test database connection
            await this.prisma.$queryRaw `SELECT 1`;
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
        }
        catch (error) {
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
//# sourceMappingURL=index.js.map