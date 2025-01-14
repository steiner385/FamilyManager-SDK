import { BasePlugin } from '../../core/BasePlugin';
import type { PluginHealthCheck } from '../../types/plugin';
import type { Event } from '../../events/types';
/**
 * Tasks plugin that demonstrates database integration and API endpoints
 */
export declare class TasksPlugin extends BasePlugin {
    private prisma;
    private metricsInterval?;
    private taskMetrics;
    constructor();
    /**
     * Initialize plugin
     */
    onInit(): Promise<void>;
    /**
     * Start plugin
     */
    onStart(): Promise<void>;
    /**
     * Stop plugin
     */
    onStop(): Promise<void>;
    /**
     * Handle events
     */
    protected handleEvent(event: Event): Promise<void>;
    /**
     * Define plugin routes
     */
    private getRoutes;
    /**
     * Get tasks
     */
    private getTasks;
    /**
     * Create task
     */
    private createTask;
    /**
     * Update task
     */
    private updateTask;
    /**
     * Delete task
     */
    private deleteTask;
    /**
     * Auto-assign tasks to new user
     */
    private autoAssignTasks;
    /**
     * Update family tasks
     */
    private updateFamilyTasks;
    /**
     * Update task metrics
     */
    private updateMetrics;
    /**
     * Get plugin health status
     */
    getHealth(): Promise<PluginHealthCheck>;
}
//# sourceMappingURL=index.d.ts.map