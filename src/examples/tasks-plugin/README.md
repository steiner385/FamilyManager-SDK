# Tasks Plugin Example

This example demonstrates how to create a full-featured plugin using the FamilyManager Plugin SDK. It implements a task management system with database integration, API endpoints, and event handling.

## Features

- Task CRUD operations via REST API
- Database integration using Prisma
- Event-based task assignments
- Family-based task organization
- Health monitoring
- Configuration management

## Database Schema

```prisma
model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime?
  assignedTo  String?
  priority    String    @default("medium")
  status      String    @default("todo")
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
  @@index([dueDate])
}
```

## API Endpoints

- `GET /api/tasks` - Get all tasks for the current user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Request/Response Examples

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the tasks plugin implementation",
  "dueDate": "2024-01-20T10:00:00Z",
  "priority": "high",
  "status": "todo"
}
```

Response:
```json
{
  "id": "task-123",
  "title": "Complete project",
  "description": "Finish the tasks plugin implementation",
  "dueDate": "2024-01-20T10:00:00Z",
  "priority": "high",
  "status": "todo",
  "userId": "user-123",
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-01-15T08:00:00Z"
}
```

## Events

### Subscriptions
- `user.created` - Auto-assign tasks to new users
- `family.updated` - Update tasks when family details change

### Publications
- `task.created` - When a new task is created
- `task.updated` - When a task is updated
- `task.completed` - When a task is marked as completed

## Configuration

```typescript
interface TasksPluginConfig {
  defaultPriority: 'low' | 'medium' | 'high';
  autoAssignTasks: boolean;
  notifyOnAssignment: boolean;
  notifyOnCompletion: boolean;
}
```

Example configuration:
```typescript
{
  defaultPriority: 'medium',
  autoAssignTasks: true,
  notifyOnAssignment: true,
  notifyOnCompletion: true
}
```

## Usage

1. Initialize the plugin:

```typescript
import { TasksPlugin } from './tasks-plugin';

const plugin = new TasksPlugin();

// Configure plugin
plugin.context.config = {
  defaultPriority: 'medium',
  autoAssignTasks: true,
  notifyOnAssignment: true,
  notifyOnCompletion: true
};

// Initialize and start
await plugin.init();
await plugin.start();
```

2. Use the API endpoints:

```typescript
// Create a task
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    priority: 'high',
    status: 'todo'
  })
});

const task = await response.json();
```

## Testing

The plugin includes comprehensive tests demonstrating:

- Lifecycle management (init, start, stop)
- API endpoint testing
- Event handling
- Configuration validation
- Health checks
- Database operations

Run the tests:

```bash
npm test src/sdk/examples/tasks-plugin
```

## Implementation Details

### Task Management
- Tasks are stored in a PostgreSQL database using Prisma
- Each task belongs to a user and can be assigned to another user
- Tasks can be filtered by status, priority, and due date
- Task updates trigger events for integration with other plugins

### Event Handling
- New users can have tasks automatically assigned to them
- Task status changes trigger appropriate notifications
- Family updates can affect task organization

### Health Monitoring
- Database connection status
- Task metrics (total, completed, overdue)
- Performance monitoring

## Best Practices Demonstrated

1. **Database Integration**
   - Proper connection management
   - Transaction handling
   - Index optimization
   - Type-safe queries

2. **API Design**
   - RESTful endpoints
   - Input validation
   - Error handling
   - Status codes

3. **Event System**
   - Event-driven architecture
   - Typed events
   - Error handling
   - Event correlation

4. **Testing**
   - Unit tests
   - Integration tests
   - Mocking
   - Test coverage

5. **Configuration**
   - Type-safe config
   - Validation
   - Defaults
   - Runtime updates

## Related Documentation

- [Plugin Development Guide](../../docs/plugin-development.md)
- [Database Integration](../../docs/database-integration.md)
- [Event System](../../docs/event-system.md)
- [Testing Guide](../../docs/testing.md)
