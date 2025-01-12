import { Hono } from 'hono';
import { EventBus } from '../events/EventBus';
import { BaseEvent } from '../events/types';

const api = new Hono();

// Get the event bus instance for each request to ensure we're using the latest instance
const getEventBus = () => EventBus.getInstance();

// POST /events - Emit an event
api.post('/events', async (c) => {
  try {
    const event = await c.req.json() as BaseEvent;
    const result = await getEventBus().emit(event);
    return c.json({ status: result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json({ error: errorMessage }, 400);
  }
});

// GET /events/channels - List registered channels
api.get('/events/channels', (c) => {
  const channels = getEventBus().getChannels();
  return c.json({ channels });
});

export const apiRoutes = api;
