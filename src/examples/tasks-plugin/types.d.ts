export declare enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export interface CreateTaskInput {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedToId?: string;
}
export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedToId?: string;
}
export interface TaskResponse {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    assignedTo: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    familyId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=types.d.ts.map